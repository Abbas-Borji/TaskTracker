import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { assignmentId: string } },
) {
  // Get the userId from the session
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const userRole = session?.user?.role;

  // Permission check to ensure only users can access this route
  if (userRole === "ADMIN" || userRole === "MANAGER") {
    return new NextResponse("Permission denied.", { status: 400 });
  }

  // Extract the assignmentId from the URL
  const assignmentId = Number(params.assignmentId);

  try {
    // Get the assignment from the database
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId, AND: { employeeId: userId } },
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
