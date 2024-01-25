import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client"; // Adjust path as necessary

export async function GET(
  request: NextRequest,
  { params }: { params: { checklistId: string } },
) {
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Allow only MANAGERs and ADMINs
  if (userRole !== "MANAGER" && userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 403 });
  }

  // Extract checklistId from the URL
  const checklistId = params.checklistId ? Number(params?.checklistId) : null;

  if (!checklistId) {
    return new NextResponse("Checklist ID is required.", { status: 400 });
  }

  try {
    // Fetch checklist details
    const checklist = await prisma.checklist.findUnique({
      where: { id: checklistId, organizationId: currentOrganization.id },
      include: { team: true },
    });

    if (!checklist) {
      return new NextResponse("Checklist not found.", { status: 404 });
    }

    // If the checklist belongs to a team
    if (checklist.team) {
      const checklistName = checklist.name;
      const hasTeam = true;
      const team = {
        id: checklist.team.id,
        name: checklist.team.name,
      };
      const employees = await prisma.memberOf.findMany({
        where: {
          teamId: checklist.team.id,
          member: {
            id: { not: userId }, // Exclude the user sending the request
            OrganizationMembership: {
              some: {
                role: "USER",
                organizationId: currentOrganization.id,
              },
            },
          },
        },
        include: { member: true },
      });
      const restructuredEmployees = employees.map((employee) => {
        return {
          id: employee.member.id,
          name: employee.member.name,
        };
      });
      return new NextResponse(
        JSON.stringify({ checklistName, hasTeam, team, restructuredEmployees }),
        { status: 200 },
      );
    } else {
      const checklistName = checklist.name;
      const hasTeam = false;
      const teams = await prisma.memberOf.findMany({
        where: {
          userId: userId,
          team: {
            organizationId: currentOrganization.id,
          },
        },
        include: { team: true },
      });
      const restructuredTeams = teams.map((team) => {
        return {
          id: team.team.id,
          name: team.team.name,
        };
      });
      return new NextResponse(
        JSON.stringify({ checklistName, hasTeam, restructuredTeams }),
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("Request error", error);
    return new NextResponse("Internal Server Error.", { status: 500 });
  }
}
