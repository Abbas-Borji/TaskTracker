import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

interface User {
  id: string;
  name: string | null;
}

interface responseDepartment {
  name: string;
  members: User[];
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;

  // Allow only ADMINs
  if (userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 403 });
  }

  // Parse request body
  const { name, members }: responseDepartment = await request.json();
  console.log(name, members);

  // Check for duplicate department
  const isDepartmentDuplicate = await prisma.department.findUnique({
    where: { name: name },
  });
  if (isDepartmentDuplicate) {
    return new NextResponse(
      JSON.stringify({ message: "Another department with the same name found." }),
      { status: 400 },
    );
  }

  // Validate members
  // Check if all members are valid members
  const validMembers = await prisma.user.findMany({
    where: {
      id: { in: members.map((member) => member.id) },
    },
  });

  // Check if the number of valid members is equal to the number of provided members
  if (members.length !== validMembers.length) {
    return new NextResponse(JSON.stringify({ message: "Invalid members." }), {
      status: 400,
    });
  }

  // Create department
  try {
    const department = await prisma.department.create({
      data: {
        name: name,
        users: {
          connect: validMembers.map((member) => ({
            id: member.id,
          })),
        },
      },
    });
    return new NextResponse(JSON.stringify(department), { status: 201 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 },
    );
  }
}
