import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "prisma/client";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;

  if (userRole != "ADMIN") {
    return new NextResponse(JSON.stringify({ message: "Permission denied." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const teams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
        manager: {
          select: {
            name: true,
          },
        },
        MemberOf: {
          select: {
            memberOf: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const teamsWithTotalNumberOfMembers = teams.map((team) => ({
      totalMembers: team.MemberOf.length,
      ...team,
    }));

    return new NextResponse(JSON.stringify(teamsWithTotalNumberOfMembers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    let errorMessage = "Unknown error occurred";
    if (typeof error === "object" && error !== null && "message" in error) {
      errorMessage = (error as { message: string }).message;
    }

    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
