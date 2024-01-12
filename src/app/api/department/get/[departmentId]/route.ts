import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
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
  // Get the userId from the session
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;

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
        users: {
          select: {
            id: true,
            name: true,
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
        members: department.users,
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
