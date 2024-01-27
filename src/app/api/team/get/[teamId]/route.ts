import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";
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

export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: number } },
) {
  // Get the userId from the session
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

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

  try {
    // Check if the team exists
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
          },
        },
        MemberOf: {
          include: {
            member: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (!team) {
      return new NextResponse(JSON.stringify({ message: "Team not found." }), {
        status: 404,
      });
    } else {
      const restructuredTeam = {
        name: team.name,
        manager: team.manager,
        members: team.MemberOf.map((memberOf) => memberOf.member),
      };
      return new NextResponse(JSON.stringify(restructuredTeam), {
        status: 200,
      });
    }
  } catch (error: any) {
    console.log(error.message);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 },
    );
  }
}
