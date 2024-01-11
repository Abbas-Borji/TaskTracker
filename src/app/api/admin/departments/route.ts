import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
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
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;

  if (userRole != "ADMIN") {
    return new NextResponse(JSON.stringify({ message: "Permission denied." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const departments = await prisma.department.findMany({
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
