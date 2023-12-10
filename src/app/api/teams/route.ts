import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  console.log("Returning teams of user with userId", userId);
  const prisma = new PrismaClient();

  try {
    const userWithTeams = await prisma.memberOf.findMany({
      where: {
        userId: userId,
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
      },
    });

    const updatedTeams = teams.map((team) => ({
      id: team.id,
      name: team.name,
      href: `/user/team/${team.id}`,
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
