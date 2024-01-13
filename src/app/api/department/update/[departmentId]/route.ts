import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

interface User {
  id: string;
  name: string;
}

interface DepartmentData {
  name: string;
  members: User[];
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { departmentId: string } },
) {
  // Get the user role from the session
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;

  // Permission check
  if (userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 403 });
  }

  // Extract departmentId from URL
  const departmentId = params.departmentId ? Number(params.departmentId) : null;

  if (!departmentId) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid departmentId." }),
      {
        status: 400,
      },
    );
  }

  // Check if department exists
  const departmentExists = await prisma.department.findUnique({
    where: { id: departmentId },
  });
  if (!departmentExists) {
    return new NextResponse(
      JSON.stringify({ message: "Department not found." }),
      {
        status: 404,
      },
    );
  }

  // Parse request body
  const departmentData: DepartmentData = await request.json();

  // Check if department name is duplicated
  const departmentNameExists = await prisma.department.findFirst({
    where: {
      name: departmentData.name,
      id: {
        not: departmentId, // Exclude the current department's name
      },
    },
  });
  if (departmentNameExists) {
    return new NextResponse(
      JSON.stringify({ message: "Department name already exists." }),
      {
        status: 400,
      },
    );
  }

  // Validate members
  const memberIds = departmentData.members.map((member) => member.id);
  const validMembers = await prisma.user.findMany({
    where: { id: { in: memberIds } },
  });
  if (memberIds.length !== validMembers.length) {
    return new NextResponse(JSON.stringify({ message: "Invalid members." }), {
      status: 400,
    });
  }

  // Update department
  try {
    // Update basic info
    await prisma.department.update({
      where: { id: departmentId },
      data: { name: departmentData.name },
    });
    // Fetch existing department members
    const existingMembers = await prisma.user.findMany({
      where: { departmentId: departmentId },
    });

    // Get the IDs of members to be removed
    const membersToRemove = existingMembers
      .filter((member) => !memberIds.includes(member.id))
      .map((member) => member.id);

    // Remove members no longer in the department
    if (membersToRemove.length > 0) {
      await prisma.user.updateMany({
        where: { id: { in: membersToRemove } },
        data: { departmentId: null },
      });
    }

    // Add new members
    const newMemberIds = memberIds.filter(
      (id) => !existingMembers.find((m) => m.id === id),
    );
    if (newMemberIds.length > 0) {
      await prisma.user.updateMany({
        where: { id: { in: newMemberIds } },
        data: { departmentId: departmentId },
      });
    }

    // Prepare response
    const updatedDepartment = await prisma.department.findUnique({
      where: { id: departmentId },
      include: { users: true },
    });

    return new NextResponse(JSON.stringify(updatedDepartment), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Update department error:", error.message);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 },
    );
  }
}
