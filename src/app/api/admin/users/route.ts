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
    const users = await prisma.user.findMany({
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
        email: true,
        OrganizationMembership: {
          where: {
            organizationId: currentOrganization.id,
          },
          select: {
            role: true,
          },
        },
        DepartmentMembership: {
          where: {
            organizationId: currentOrganization.id,
          },
          select: {
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const restructuredUsers = users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.OrganizationMembership[0]?.role, // Each user has only one role per organization
        department: user.DepartmentMembership.map((dm) => dm.department),
        departmentName: user.DepartmentMembership.map(
          (dm) => dm.department.name,
        ),
      };
    });

    return new NextResponse(JSON.stringify(restructuredUsers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 },
    );
  }
}
