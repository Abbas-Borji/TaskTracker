import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";

interface FeedbackData {
  submissionId: number;
  feedbackContent: string;
}

export async function POST(request: NextRequest) {
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Allow only MANAGERs and ADMINs
  if (userRole !== "MANAGER" && userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 403 });
  }

  // Parse request body
  const { submissionId, feedbackContent }: FeedbackData = await request.json();

  // Validate submission
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
  });
  if (!submission) {
    return new NextResponse(
      JSON.stringify({ message: "Submission not found." }),
      { status: 404 },
    );
  }

  // Get assignment
  const assignment = await prisma.assignment.findUnique({
    where: { id: submission.assignmentId },
    include: {
      checklist: {
        include: {
          manager: true,
        },
      },
    },
  });

  // Check if the user is the manager of the checklist
  if (userRole === "MANAGER" && assignment?.checklist.manager.id !== userId) {
    return new NextResponse("Permission denied.", { status: 403 });
  }

  // Check if the assignment already has feedback
  const existingFeedback = await prisma.feedback.findFirst({
    where: { assignmentId: submission.assignmentId },
  });
  if (existingFeedback) {
    return new NextResponse(
      JSON.stringify({ message: "Feedback already exists." }),
      { status: 400 },
    );
  }

  // Create feedback and update submission status
  try {
    console.log(feedbackContent);
    const feedback = await prisma.feedback.create({
      data: {
        assignmentId: submission.assignmentId,
        content: feedbackContent,
        managerId: userId!,
        organizationId: currentOrganization.id,
      },
    });
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: "REVIEWED" },
    });
    return new NextResponse(JSON.stringify(feedback), { status: 201 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 },
    );
  }
}
