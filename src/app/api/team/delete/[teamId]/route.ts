import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { teamId: string } },
) {
  // Get the userRole from the session
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Extract teamId from URL
  const teamId = params.teamId ? Number(params.teamId) : null;

  // Permission check to ensure only admins can access this route
  if (userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 400 });
  }

  // Validate the team
  if (teamId) {
    const teamExists = await prisma.team.findUnique({
      where: { id: teamId },
    });
    if (!teamExists) {
      return new NextResponse(JSON.stringify({ message: "Team not found." }), {
        status: 404,
      });
    }
    // Delete the team
    try {
      const team = await prisma.team.delete({
        where: { id: teamId },
      });

      return new NextResponse(JSON.stringify(team), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ message: "Internal Server Error." }),
        { status: 500 },
      );
    }
  } else {
    return new NextResponse(
      JSON.stringify({ message: "Team ID is not provided." }),
      {
        status: 400,
      },
    );
  }
}
