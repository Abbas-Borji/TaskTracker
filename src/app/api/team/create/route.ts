import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";

interface User {
  id: string;
  name: string;
}

interface TeamData {
  name: string;
  manager: User;
  members: User[];
}

export async function POST(request: NextRequest) {
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Allow only ADMINs
  if (userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 403 });
  }

  // Parse request body
  const { name, manager, members }: TeamData = await request.json();

  // Check for duplicate team
  const isTeamDuplicate = await prisma.team.findUnique({
    where: { name: name },
  });
  if (isTeamDuplicate) {
    return new NextResponse(
      JSON.stringify({ message: "Another team with the same name found." }),
      { status: 400 },
    );
  }

  // Validate manager
  // Check if manager is a valid user
  const validManager = await prisma.user.findUnique({
    where: { id: manager.id },
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
      id: { in: members.map((member) => member.id) },
      OrganizationMembership: {
        some: {
          organizationId: currentOrganization.id,
        },
      },
    },
  });

  // Check if the number of valid users is equal to the number of provided users
  if (members.length !== validMembers.length) {
    return new NextResponse(JSON.stringify({ message: "Invalid users." }), {
      status: 400,
    });
  }

  // Remove manager from members if included
  const membersWithoutManager = members.filter(
    (member) => member.id !== manager.id,
  );

  // Create team
  try {
    const team = await prisma.team.create({
      data: {
        name: name,
        manager: { connect: { id: manager.id } },
        Organization: { connect: { id: currentOrganization.id } },
        MemberOf: {
          create: [
            ...membersWithoutManager.map((member) => ({
              userId: member.id,
            })),
            {
              userId: manager.id,
            },
          ],
        },
      },
    });
    return new NextResponse(JSON.stringify(team), { status: 201 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 },
    );
  }
}
