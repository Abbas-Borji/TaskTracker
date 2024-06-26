import { NextRequest, NextResponse } from "next/server";
import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";
import prisma from "prisma/client";

export async function GET(req: NextRequest) {
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  if (userRole != "ADMIN") {
    return new NextResponse(JSON.stringify({ message: "Permission denied." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const submissions = await prisma.submission.findMany({
      where: {
        organizationId: currentOrganization.id,
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        user: {
          select: {
            name: true,
          },
        },
        assignment: {
          select: {
            checklist: {
              select: {
                id: true,
                name: true,
                manager: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const submissionDates = submissions.map((submission) => {
      const date = new Date(submission.createdAt);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    });

    const submissionsWithFormattedSubmissionDates = submissions.map(
      (submission, index) => ({
        ...submission,
        createdAt: submissionDates[index],
      }),
    );

    return new NextResponse(JSON.stringify(submissionsWithFormattedSubmissionDates), {
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
