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
    const feedbacks = await prisma.feedback.findMany({
      where: {
        organizationId: currentOrganization.id,
      },
      select: {
        id: true,
        createdAt: true,
        assignment: {
          select: {
            employee: {
              select: {
                name: true,
              },
            },
            submission: { select: { id: true } },
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

    const feedbackDates = feedbacks.map((feedback) => {
      const date = new Date(feedback.createdAt);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    });

    const feedbacksWithFormattedFeedbackDates = feedbacks.map(
      (feedback, index) => ({
        ...feedback,
        createdAt: feedbackDates[index],
      }),
    );

    return new NextResponse(
      JSON.stringify(feedbacksWithFormattedFeedbackDates),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
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
