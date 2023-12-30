import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

interface AssignmentData {
  checklistId: number;
  teamId: number;
  employeeIds: string[];
  dueDate: Date;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;

  // Allow only MANAGERs and ADMINs
  if (userRole !== "MANAGER" && userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 403 });
  }

  // Parse request body
  const { checklistId, teamId, employeeIds, dueDate }: AssignmentData =
    await request.json();

  // Validate checklist
  const checklist = await prisma.checklist.findUnique({
    where: { id: checklistId },
  });
  if (!checklist) {
    return new NextResponse(
      JSON.stringify({ message: "Checklist not found." }),
      { status: 404 },
    );
  }

  // Check if the checklist belongs to a team
  if (checklist.teamId) {
    // Check if the teamId was provided
    if (teamId) {
      // Validate team
      const team = await prisma.team.findUnique({ where: { id: teamId } });
      if (!team) {
        return new NextResponse(
          JSON.stringify({ message: "Team not found." }),
          {
            status: 404,
          },
        );
      }
    } else {
      return new NextResponse(
        JSON.stringify({ message: "Team ID is required." }),
        { status: 400 },
      );
    }

    // Check if the teamId matches the checklist's teamId
    if (checklist.teamId !== teamId) {
      return new NextResponse(
        JSON.stringify({
          message:
            "The provided Team ID does not match with the checklist's Team ID.",
        }),
        { status: 400 },
      );
    }
  } else {
    // If the checklist doesn't belong to a team
    // Check if the teamId was provided
    if (teamId) {
      // Validate team
      const team = await prisma.team.findUnique({ where: { id: teamId } });
      if (!team) {
        return new NextResponse(
          JSON.stringify({ message: "Team not found." }),
          {
            status: 404,
          },
        );
      }
    } else {
      return new NextResponse(
        JSON.stringify({ message: "Team ID is required." }),
        { status: 400 },
      );
    }

    // Update checklist using the provided teamId
    const updatedChecklist = await prisma.checklist.update({
      where: { id: checklistId },
      data: { teamId },
    });
  }

  // Validate employeeIds
  // Check if all employeeIds are valid users with role "USER"
  const employees = await prisma.user.findMany({
    where: {
      id: { in: employeeIds },
      role: "USER",
    },
  });

  // Check if the number of valid employees is equal to the number of provided employeeIds
  if (employees.length !== employeeIds.length) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid employee IDs." }),
      { status: 400 },
    );
  }

  // Check if any of the employees have already been assigned the checklist
  const existingAssignments = await prisma.assignment.findMany({
    where: {
      employeeId: { in: employeeIds },
      checklistId,
    },
  });

  if (existingAssignments.length > 0) {
    return new NextResponse(
      JSON.stringify({
        message:
          "One or more employees have already been assigned this checklist.",
      }),
      { status: 400 },
    );
  }

  // Check if the dueDate is a valid date
  if (isNaN(new Date(dueDate).getTime())) {
    return new NextResponse(JSON.stringify({ message: "Invalid due date." }), {
      status: 400,
    });
  }

  // Check if the dueDate is in the future
  if (new Date(dueDate) < new Date()) {
    return new NextResponse(
      JSON.stringify({ message: "Due date must be a future date." }),
      { status: 400 },
    );
  }

  // Create assignments
  try {
    const assignments = await prisma.assignment.createMany({
      data: employeeIds.map((id) => ({
        employeeId: id,
        checklistId: checklistId,
        teamId: teamId,
        dueDate: dueDate,
      })),
    });
    return new NextResponse(JSON.stringify(assignments), { status: 201 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 },
    );
  }
}
