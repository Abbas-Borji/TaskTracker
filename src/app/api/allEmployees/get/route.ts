import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";

export async function GET(request: NextRequest) {
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Allow only ADMINs
  if (userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 403 });
  }

  try {
    const employees = await prisma.user.findMany({
      where: {
        OrganizationMembership: {
          some: {
            organizationId: currentOrganization.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const response = {
      employees,
    };

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
