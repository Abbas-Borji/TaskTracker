import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client"; 

export async function GET(
  request: NextRequest,
  { params }: { params: { submissionId: string } },
) {
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Extract submissionId from the URL
  const submissionId = params.submissionId
    ? Number(params?.submissionId)
    : null;

  if (!submissionId) {
    return new NextResponse("Submission ID is required.", { status: 400 });
  }

  try {
    let submission;

    switch (userRole) {
      case "ADMIN":
        submission = await prisma.submission.findUnique({
          where: { id: submissionId },
          include: {
            assignment: {
              include: {
                checklist: true,
                feedback: {
                  include: {
                    manager: true,
                  },
                },
              },
            },
          },
        });
        break;
      case "USER":
        submission = await prisma.submission.findUnique({
          where: { id: submissionId, userId: userId },
          include: {
            assignment: {
              include: {
                checklist: true,
                feedback: {
                  include: {
                    manager: true,
                  },
                },
              },
            },
          },
        });
        break;
      case "MANAGER":
        submission = await prisma.submission.findUnique({
          where: { id: submissionId },
          include: {
            assignment: {
              include: {
                checklist: {
                  include: {
                    manager: true,
                  },
                },
                feedback: {
                  include: {
                    manager: true,
                  },
                },
              },
            },
          },
        });

        if (submission && submission.assignment.checklist.manager.id !== userId)
          return new NextResponse("Permission denied.", { status: 403 });
        break;
      default:
        return new NextResponse("Undefined role.", { status: 400 });
    }

    if (!submission) {
      return new NextResponse("Submission not found.", { status: 404 });
    }

    const checklistName = submission.assignment.checklist.name;
    const feedbackContent = submission.assignment.feedback?.content;
    const feedbackCreatedAt = submission.assignment.feedback?.createdAt;
    // Reformat date
    const feedbackFormattedDate = feedbackCreatedAt?.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
    const managerName = submission.assignment.feedback?.manager?.name;
    const managerImage = submission.assignment.feedback?.manager?.image;

    return new NextResponse(
      JSON.stringify({
        checklistName,
        feedbackContent,
        feedbackFormattedDate,
        managerName,
        managerImage,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Request error", error);
    return new NextResponse("Internal Server Error.", { status: 500 });
  }
}
