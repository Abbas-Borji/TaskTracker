import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";

export async function GET(request: NextRequest) {
  // Get the userId from the session
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Permission check to ensure only users can access this route
  if (userRole === "ADMIN" || userRole === "MANAGER") {
    return new NextResponse("Permission denied.", { status: 400 });
  }

  // Extract the teamId from the URL
  const url = request.nextUrl;
  const teamId = url.pathname.split("/").pop();

  // Get the team name
  const teamName = await prisma.team.findUnique({
    where: {
      id: Number(teamId),
    },
    select: {
      name: true,
    },
  });

  // Get all the assignments to a user in the specified team
  const assignments = await prisma.assignment.findMany({
    where: {
      teamId: Number(teamId),
      employeeId: userId,
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

  const submittedAtDates = assignments.map((assignment) => {
    if (assignment.submission && assignment.submission.createdAt) {
      const date = new Date(assignment.submission.createdAt);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return null; // Return null or a default value if submission or createdAt is not available
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
        managerName: assignment.checklist.manager.name,
      },
    };
  });

  // Filter assignments to include only those with no submission
  const unSubmittedAssignments = assignments.filter(
    (assignment) => !assignment.submission,
  );

  // Get the due dates from the assignments
  const dueDates = unSubmittedAssignments.map((assignment) => {
    const date = new Date(assignment.dueDate);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Get the viewed status from the assignments
  const assignmentViews = unSubmittedAssignments.map(
    (assignment) => assignment.viewedByEmployee,
  );

  // Get the checklist ids from the assignments
  const checklistIds = unSubmittedAssignments.map(
    (assignment) => assignment.checklistId,
  );

  // Get the checklists including their managers using the checklist ids
  const checklists = await prisma.checklist.findMany({
    where: {
      id: {
        in: checklistIds,
      },
    },
    include: {
      manager: true,
    },
  });

  // Structure the checklist data to be returned
  const structuredchecklists = checklists.map((checklist, index) => ({
    info: {
      id: unSubmittedAssignments[index]?.id,
      name: checklist.name,
      dueDate: dueDates[index],
      viewed: assignmentViews[index],
    },
    manager: {
      id: checklist.manager.id,
      name: checklist.manager.name,
    },
  }));

  // Add the team name to the final response
  const finalResponse = {
    teamName,
    checklists: structuredchecklists,
    submissions: structuredSubmissions,
  };

  console.log(dueDates);
  // Return the final response
  return new NextResponse(JSON.stringify(finalResponse), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
