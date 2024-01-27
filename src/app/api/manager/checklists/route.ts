import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";

export async function GET(request: NextRequest) {
  // Get the userId from the session
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Permission check to ensure only managers can access this route
  if (userRole === "ADMIN" || userRole === "USER") {
    return new NextResponse("Permission denied.", { status: 400 });
  }

  // Get all checklists of this manager in the specified team
  const checklists = await prisma.checklist.findMany({
    where: {
      managerId: userId,
      organizationId: currentOrganization.id,
    },
    include: {
      team: true,
    },
  });

  // Get Checklists Created At Dates
  const createdAtDates = checklists.map((checklist) => {
    if (checklist.createdAt) {
      const date = new Date(checklist.createdAt);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return null;
  });

  // Structure the checklist data to be returned
  const structuredchecklists = checklists.map((checklist, index) => ({
    info: {
      id: checklist.id,
      name: checklist.name,
      createdAt: createdAtDates[index],
      teamName: checklist.team?.name,
    },
  }));

  // Add the team name to the final response
  const finalResponse = {
    checklists: structuredchecklists,
  };

  // Return the final response
  return new NextResponse(JSON.stringify(finalResponse), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
