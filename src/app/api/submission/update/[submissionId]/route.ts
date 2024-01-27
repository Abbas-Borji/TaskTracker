import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { submissionId: string } },
) {
  // Get the userId from the session
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Allow only MANAGERs and ADMINs
  if (userRole !== "MANAGER" && userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 403 });
  }

  // Extract the submissionId from the URL
  const submissionId = Number(params.submissionId);

  // Check if the submission exists
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      assignment: {
        include: {
          checklist: {
            include: {
              manager: true,
            },
          },
        },
      },
    },
  });
  if (!submission) {
    return new NextResponse("Submission not found.", { status: 404 });
  }

  // Check if the user is the manager of the checklist
  if (
    userRole === "MANAGER" &&
    submission.assignment.checklist.manager.id !== userId
  ) {
    return new NextResponse("Permission denied.", { status: 403 });
  }

  if (submission?.status === "PENDING") {
    try {
      // Update the submission
      const submission = await prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: "OPENED",
        },
      });

      // Check if the process was successful
      if (!submission) {
        return new NextResponse("Submission not found.", { status: 404 });
      }

      return new NextResponse(JSON.stringify(submission), { status: 200 });
    } catch (error) {
      return new NextResponse("Internal Server Error.", { status: 500 });
    }
  } else {
    return new NextResponse(
      "Submission is already opened or reviewed before.",
      { status: 400 },
    );
  }
}
