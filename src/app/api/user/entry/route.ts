import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "prisma/client";

const GENERAL_TEAM_ID = 1; // ID of the General Team

export async function GET(request: NextRequest) {
  // Get the userId and role from the session
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const role = session?.user?.role;

  // If the user is not logged in, redirect to the login page
  if (!userId) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Check if the user is an admin then redirect him to the admin dashboard
  if (role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin/users", request.url));
  }

  // Check if the user is already a member of the 'General' team
  const isMemberOfGeneralTeam = await prisma.memberOf.findFirst({
    where: {
      userId: userId,
      teamId: GENERAL_TEAM_ID,
    },
  });

  // If the user is not a member of the 'General' team, add them to it
  if (!isMemberOfGeneralTeam) {
    // Add the user to the 'General' team
    await prisma.memberOf.create({
      data: {
        userId: userId,
        teamId: GENERAL_TEAM_ID,
      },
    });
  }

  // Redirect to the General team's page
  return NextResponse.redirect(
    new URL(`/user/team/${GENERAL_TEAM_ID}`, request.url),
  );
}
