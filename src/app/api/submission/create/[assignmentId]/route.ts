import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "prisma/client";

interface Submission {
  userId?: string;
  assignmentId?: number;
  submittedOptions: SubmittedOption[];
}

interface SubmittedOption {
  optionId: number;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { assignmentId: string } },
) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user.role;
  const userId = session!.user.id;
  // Only users can submit
  if (userRole === "ADMIN" || userRole === "MANAGER") {
    return new NextResponse("Permission denied", { status: 403 });
  }

  // Check if the request has an assignment id
  const assignmentId = params.assignmentId ? Number(params.assignmentId) : null;

  if (!assignmentId) {
    return new NextResponse("Assignment id is required", { status: 400 });
  }

  // Check if the assignment exists
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { submission: true },
  });

  if (!assignment) {
    return new NextResponse("Assignment not found", { status: 404 });
  }

  // Check if the assignment has already been submitted
  if (assignment.submission) {
    return new NextResponse("Assignment has already been submitted", {
      status: 400,
    });
  }

  // Parse the request body
  const submissionData: Submission = await request.json();

  try {
    const submission = await prisma.submission.create({
      data: {
        userId,
        assignmentId,
      },
    });

    const submittedOptionsArray = submissionData.submittedOptions.map(
      (option) => ({
        submissionId: submission.id,
        optionId: option.optionId,
      }),
    );

    const submittedOptions = await prisma.submittedOption.createMany({
      data: submittedOptionsArray,
    });

    // Successful submission
    return new NextResponse(JSON.stringify(submission), { status: 200 });
  } catch (error) {
    const errorMessage =
      "An error occured while creating a new submission for assignmentId: " +
      assignmentId;
    console.log(errorMessage);
    return new NextResponse(errorMessage, { status: 500 });
  }
}
