import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function GET(request: NextRequest) {
  // Get the userId from the session
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const userRole = session?.user?.role;

  // Permission check to ensure only managers can access this route
  if (userRole === "ADMIN" || userRole === "USER") {
    return new NextResponse("Permission denied.", { status: 400 });
  }

  // Get all checklists of this manager in the specified team
  const checklists = await prisma.checklist.findMany({
    where: {
      managerId: userId,
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
