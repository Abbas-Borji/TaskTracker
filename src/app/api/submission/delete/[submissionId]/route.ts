import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { submissionId: string } },
) {
  // Get the userId from the session
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;
  // Extract submissionId
  const submissionId = params.submissionId ? Number(params.submissionId) : null;

  // Permission check to ensure only admins and managers can access this route
  if (userRole === "USER") {
    return new NextResponse("Permission denied.", { status: 400 });
  }

  // Validate the submissionId if it exists
  if (submissionId) {
    const submissionExists = await prisma?.submission.findUnique({
      where: { id: submissionId },
    });
    if (!submissionExists) {
      return new NextResponse(
        JSON.stringify({ message: "Submission not found." }),
        {
          status: 404,
        },
      );
    }
    // Delete the submission
    try {
      const submission = await prisma.submission.delete({
        where: { id: submissionId },
      });

      const feedbackOfSubmission = await prisma.feedback.delete({
        where: { assignmentId: submission.assignmentId },
      });

      return new NextResponse(
        JSON.stringify({ submission, feedbackOfSubmission }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ message: "Internal Server Error." }),
        { status: 500 },
      );
    }
  } else {
    return new NextResponse(
      JSON.stringify({ message: "Submission ID not provided." }),
      {
        status: 400,
      },
    );
  }
}
