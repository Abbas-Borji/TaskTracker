import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";

interface User {
  id: string;
  name: string;
}

interface TeamData {
  name: string;
  manager: User;
  members: User[];
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { teamId: number } },
) {
  // Get the userId from the session
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;

  // Permission check to ensure only ADMINS can access this route
  if (userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 400 });
  }

  // Extract teamId from the url parameter
  const teamId = params.teamId ? Number(params.teamId) : null;

  // Validate the teamId
  if (!teamId) {
    return new NextResponse(JSON.stringify({ message: "Invalid teamId." }), {
      status: 400,
    });
  }

  // Check if the team exists
  const teamExists = await prisma.team.findUnique({
    where: { id: teamId },
  });
  if (!teamExists) {
    return new NextResponse(JSON.stringify({ message: "Team not found." }), {
      status: 404,
    });
  }

  // Parse the request body
  const teamData: TeamData = await request.json();

  // Validate manager
  // Check if manager is a valid user
  const validManager = await prisma.user.findUnique({
    where: { id: teamData.manager.id },
  });
  if (!validManager) {
    return new NextResponse(JSON.stringify({ message: "Invalid manager." }), {
      status: 400,
    });
  }

  // Validate members
  // Check if all members are valid users
  const validMembers = await prisma.user.findMany({
    where: {
      id: { in: teamData.members.map((member) => member.id) },
    },
  });

  // Check if the number of valid users is equal to the number of provided users
  if (teamData.members.length !== validMembers.length) {
    return new NextResponse(JSON.stringify({ message: "Invalid users." }), {
      status: 400,
    });
  }

  // Update the team
  try {
    // First, update the team's basic information
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        name: teamData.name,
      },
    });

    // Update the manager
    await prisma.team.update({
      where: { id: teamId },
      data: {
        manager: { connect: { id: teamData.manager.id } },
      },
    });

    // Fetch existing users for this team
    const existingMembers = await prisma.memberOf.findMany({
      where: { teamId: teamId },
      include: { member: true },
    });

    // Get the IDs of the members not present in the request
    const membersToDelete = existingMembers
      .filter(
        (memberOf) =>
          !teamData.members.find((m) => m.id === memberOf.member.id),
      )
      .map((memberOf) => memberOf.member.id);

    // Delete the members from the database
    await prisma.memberOf.deleteMany({
      where: {
        userId: {
          in: membersToDelete,
        },
        teamId: teamId,
      },
    });

    // Filter out new members
    const isNewMember = (member: User) =>
      !existingMembers.find((m) => m.member.id === member.id);
    const newMembers = teamData.members.filter(isNewMember);

    // Create MemberOf records for the new users
    await prisma.memberOf.createMany({
      data: newMembers.map((user) => ({
        userId: user.id,
        teamId,
      })),
    });

    // Structure the updated team object
    const updatedTeamObject = {
      ...updatedTeam,
      manager: teamData.manager,
      members: teamData.members,
    };

    return new NextResponse(JSON.stringify(updatedTeamObject), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.log(error.message);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 },
    );
  }
}
