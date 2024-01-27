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

  // Extract the teamId from the URL
  const url = request.nextUrl;
  const teamId = Number(url.pathname.split("/").pop());

  // Get the team name
  const teamName = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
    select: {
      name: true,
    },
  });

  // Get all checklists of this manager in the specified team
  const checklists = await prisma.checklist.findMany({
    where: {
      managerId: userId,
      teamId: teamId,
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

  // Get the IDs of the above checklists
  const checklistIds = checklists.map((checklist) => checklist.id);

  // Get all the assignments of this manager in the specified team
  const assignments = await prisma.assignment.findMany({
    where: {
      teamId: teamId,
      checklistId: {
        in: checklistIds,
      },
    },
    include: {
      submission: true,
      checklist: {
        include: {
          manager: true,
        },
      },
    },
  });

  // Filter assignments to include only those with a submission
  const filteredAssignments = assignments.filter(
    (assignment) => assignment.submission,
  );

  // Then, map over the filtered assignments to structure your submissions data
  const structuredSubmissions = filteredAssignments.map((assignment) => {
    const submittedAt = assignment.submission?.createdAt
      ? new Date(assignment.submission.createdAt).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

    return {
      id: assignment.submission?.id,
      status: assignment.submission?.status,
      submittedAt: submittedAt,
      archivedByManager: assignment.submission?.archivedByManager,
      checklistinfo: {
        name: assignment.checklist.name,
      },
    };
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
    teamName,
    checklists: structuredchecklists,
    submissions: structuredSubmissions,
  };

  // Return the final response
  return new NextResponse(JSON.stringify(finalResponse), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
