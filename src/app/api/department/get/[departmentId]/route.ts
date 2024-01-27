import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";

interface User {
  id: string;
  name: string | null;
}

interface responseDepartment {
  name: string;
  members: User[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { departmentId: number } },
) {
  // Get the userRole from the session
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Permission check to ensure only ADMINS can access this route
  if (userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 400 });
  }

  // Extract departmentId from the url parameter
  const departmentId = params.departmentId ? Number(params.departmentId) : null;

  // Validate the departmentId
  if (!departmentId) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid departmentId." }),
      {
        status: 400,
      },
    );
  }

  try {
    // Check if the department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      include: {
        DepartmentMembership: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!department) {
      return new NextResponse(
        JSON.stringify({ message: "Department not found." }),
        {
          status: 404,
        },
      );
    } else {
      const restructuredDepartment: responseDepartment = {
        name: department.name,
        members: department.DepartmentMembership.map((dm) => dm.user),
      };
      return new NextResponse(JSON.stringify(restructuredDepartment), {
        status: 200,
      });
    }
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 },
    );
  }
}
