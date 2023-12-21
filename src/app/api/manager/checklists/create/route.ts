// pages/api/checklists/index.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { Checklist } from "@/app/common/types/CreateChecklist";

export async function POST(request: NextRequest) {
  // Get the userId from the session
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;
  const userId = session?.user?.id;

  // Permission check to ensure only managers can access this route
  if (userRole === "ADMIN" || userRole === "USER") {
    return new NextResponse("Permission denied.", { status: 400 });
  }

  // Extract teamId from the query parameter, if present
  const url = request.nextUrl;
  const teamIdQuery = url.searchParams.get("teamId");
  const teamId = teamIdQuery ? Number(teamIdQuery) : null;

  // Validate the teamId if it exists
  if (teamId) {
    const teamExists = await prisma.team.findUnique({
      where: { id: teamId },
    });
    if (!teamExists) {
      return new NextResponse(JSON.stringify({ message: "Team not found." }), {
        status: 404,
      });
    }
  }

  // Parse the request body
  const checklistData: Checklist = await request.json();

  // Create the checklist
  try {
    const checklist = await prisma.checklist.create({
      data: {
        name: checklistData.name,
        managerId: userId as string,
        teamId: teamId, // teamId can be null
        questions: {
          create: checklistData.questions.map((q) => ({
            content: q.content,
            options: {
              create: q.options,
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(checklist), {
      status: 201,
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
}
