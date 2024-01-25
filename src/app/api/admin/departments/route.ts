import { NextRequest, NextResponse } from "next/server";
import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";
import prisma from "prisma/client";

interface User {
  id: string;
  name: string | null;
}

interface responseDepartment {
  id: number;
  name: string;
  totalMembers: number;
  users: User[];
}

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
    const departments = await prisma.department.findMany({
      where: { organizationId: currentOrganization.id },
      select: {
        id: true,
        name: true,
        users: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const departmentsWithTotalNumberOfMembers: responseDepartment[] =
      departments.map((department) => ({
        ...department,
        totalMembers: department.users.length,
      }));

    return new NextResponse(
      JSON.stringify(departmentsWithTotalNumberOfMembers),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 },
    );
  }
}
