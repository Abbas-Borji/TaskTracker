import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";

interface SearchResult {
  id: number;
  name: string;
  link: string;
}

export async function GET(request: NextRequest) {
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  if (userRole !== "USER" && userRole !== "MANAGER") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    let searchResults: SearchResult[] = [];

    switch (userRole) {
      case "USER":
        // Get all the assignments to a user
        const employeeAssignments = await prisma.assignment.findMany({
          where: {
            employeeId: userId,
            organizationId: currentOrganization.id,
          },
          include: {
            submission: true,
            checklist: true,
          },
        });

        // Filter assignments to include only those with no submission
        const unSubmittedAssignments = employeeAssignments
          .filter((assignment) => !assignment.submission)
          .map((assignment) => ({
            id: assignment.id,
            link: `/${currentOrganization.urlSegment}/user/assignment/${assignment.id}`,
            name: assignment.checklist.name,
          }));

        // Get all submissions of this user
        const employeeSubmissions = employeeAssignments
          .filter((assignment) => assignment.submission)
          .map((assignment) => ({
            id: assignment.submission!.id,
            link: `/${currentOrganization.urlSegment}/user/submission/${assignment.submission!.id}`,
            name: assignment.checklist.name,
          }));

        searchResults = [...unSubmittedAssignments, ...employeeSubmissions];
        break;

      case "MANAGER":
        // Get all checklists of this manager
        const checklists = await prisma.checklist.findMany({
          where: {
            managerId: userId,
            organizationId: currentOrganization.id,
          },
          select: {
            id: true,
            name: true,
          },
        });

        // Get all the assignments of this manager based on his checklists
        const assignments = await prisma.assignment.findMany({
          where: {
            checklistId: {
              in: checklists.map((checklist) => checklist.id),
            },
            organizationId: currentOrganization.id,
          },
          include: {
            submission: true,
            checklist: {
              select: {
                name: true,
              },
            },
          },
        });

        // Get all submissions of this manager based on his assignments
        const submissions = assignments
          .filter((assignment) => assignment.submission)
          .map((assignment) => ({
            id: assignment.submission!.id,
            link: `/${currentOrganization.urlSegment}/manager/submission/${assignment.submission!.id}`,
            name: assignment.checklist.name,
          }));

        // Transform checklists and submissions into SearchResult format
        searchResults = [
          ...checklists.map((checklist) => ({
            id: checklist.id,
            name: checklist.name,
            link: `/${currentOrganization.urlSegment}/manager/checklist/edit?checklistId=${checklist.id}`,
          })),
          ...submissions,
        ];
        break;
      default:
        return new NextResponse("Unrecognized role.", { status: 401 });
    }

    return new NextResponse(JSON.stringify(searchResults), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
