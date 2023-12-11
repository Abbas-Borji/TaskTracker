import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "prisma/client";

export async function GET(request: NextRequest) {
  // Get userId from session
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // Get teams for this user
  const teamsIds = await prisma.memberOf.findMany({
    where: {
      userId: userId,
    },
    select: {
      teamId: true,
    },
  });

  // Check if the user is part of any teams, and redirect accordingly to first team's page or not found page
  if (teamsIds.length > 0) {
    return NextResponse.redirect(
      new URL(`/user/team/${teamsIds[0]!.teamId}`, request.url),
    );
  } else {
    console.log("User is not part of any teams");
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
}
