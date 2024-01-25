import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client"; // Adjust path as necessary

export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } },
) {
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Allow only MANAGERs and ADMINs
  if (userRole !== "MANAGER" && userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 403 });
  }

  // Extract teamId from the URL
  const teamId = params.teamId ? Number(params.teamId) : null;

  if (!teamId) {
    return new NextResponse("Team ID is required.", { status: 400 });
  }

  try {
    // Fetch team members
    const members = await prisma.memberOf.findMany({
      where: {
        teamId: teamId,
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

    const restructuredMembers = members.map((member) => {
      return {
        id: member.member.id,
        name: member.member.name,
      };
    });

    return new NextResponse(JSON.stringify(restructuredMembers), {
      status: 200,
    });
  } catch (error) {
    console.error("Request error", error);
    return new NextResponse("Internal Server Error.", { status: 500 });
  }
}
