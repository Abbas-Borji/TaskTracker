import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";

export async function GET(request: NextRequest) {
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();
  console.log("Returning teams of user with userId", userId);

  try {
    const userWithTeams = await prisma.memberOf.findMany({
      where: {
        userId: userId,
        team: {
          organizationId: currentOrganization.id,
        },
      },
    });

    if (!userWithTeams) {
      return new NextResponse("User not found", { status: 404 });
    }

    const teams = await prisma.team.findMany({
      where: {
        id: {
          in: userWithTeams.map((team) => team.teamId),
        },
        organizationId: currentOrganization.id,
      },
    });

    const updatedTeams = teams.map((team) => ({
      id: team.id,
      name: team.name,
      href:
        userRole === "MANAGER"
          ? `/${currentOrganization.urlSegment}/manager/team/${team.id}`
          : `/${currentOrganization.urlSegment}/user/team/${team.id}`,
    }));

    return new NextResponse(JSON.stringify(updatedTeams), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching user teams:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
