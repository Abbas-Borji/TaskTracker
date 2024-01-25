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
    const checklists = await prisma.checklist.findMany({
      where: {
        organizationId: currentOrganization.id,
      },
      select: {
        id: true,
        name: true,
        manager: {
          select: {
            name: true,
          },
        },
        questions: {
          select: {
            id: true,
          },
        },
      },
    });

    const checklistsWithTotalNumberOfQuestions = checklists.map(
      (checklist) => ({
        totalQuestions: checklist.questions.length,
        ...checklist,
      }),
    );

    return new NextResponse(
      JSON.stringify(checklistsWithTotalNumberOfQuestions),
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
