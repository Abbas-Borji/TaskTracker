import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";

export async function GET(
  request: NextRequest,
  { params }: { params: { assignmentId: string } },
) {
  // Get the userId from the session
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Permission check to ensure only users can access this route
  if (userRole === "ADMIN" || userRole === "MANAGER") {
    return new NextResponse("Permission denied.", { status: 403 });
  }

  // Extract the assignmentId from the URL
  const assignmentId = Number(params.assignmentId);

  try {
    // Get the assignment from the database
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId, employeeId: userId },
      include: {
        checklist: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    // Check if the assignment exists
    if (!assignment) {
      return new NextResponse("Assignment not found.", { status: 404 });
    }

    // Restructure the assignment object
    const structuredAssignment = {
      title: assignment.checklist.name,
      questions: assignment.checklist.questions.map((question) => ({
        id: question.id,
        content: question.content,
        options: question.options.map((option) => ({
          id: option.id,
          content: option.content,
        })),
      })),
    };

    // Return the structured assignment
    return new NextResponse(JSON.stringify(structuredAssignment), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Internal Server Error.", { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { assignmentId: string } },
) {
  // Get the userId from the session
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Permission check to ensure only users can access this route
  if (userRole === "ADMIN" || userRole === "MANAGER") {
    return new NextResponse("Permission denied.", { status: 403 });
  }

  // Extract the assignmentId from the URL
  const assignmentId = Number(params.assignmentId);

  try {
    // Update the assignment
    const assignment = await prisma.assignment.update({
      where: { id: assignmentId, employeeId: userId },
      data: {
        viewedByEmployee: true,
      },
    });

    // Check if the process was successful
    if (!assignment) {
      return new NextResponse("Assignment not found.", { status: 404 });
    }

    return new NextResponse(JSON.stringify(assignment), { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error.", { status: 500 });
  }
}
