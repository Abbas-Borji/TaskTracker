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
    const assignments = await prisma.assignment.findMany({
      where: {
        organizationId: currentOrganization.id,
      },
      select: {
        id: true,
        dueDate: true,
        employee: {
          select: {
            name: true,
          },
        },
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
    });

    const dueDates = assignments.map((assignment) => {
      const date = new Date(assignment.dueDate);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    });

    const assignmentsWithFormattedDueDates = assignments.map(
      (assignment, index) => ({
        ...assignment,
        dueDate: dueDates[index],
      }),
    );

    return new NextResponse(JSON.stringify(assignmentsWithFormattedDueDates), {
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
