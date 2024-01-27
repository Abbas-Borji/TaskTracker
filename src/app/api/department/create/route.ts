import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";

interface User {
  id: string;
  name: string | null;
}

interface responseDepartment {
  name: string;
  members: User[];
}

export async function POST(request: NextRequest) {
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Allow only ADMINs
  if (userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 403 });
  }

  // Parse request body
  const { name, members }: responseDepartment = await request.json();
  console.log(name, members);

  /// Check for duplicate department
  const isDepartmentDuplicate = await prisma.department.findUnique({
    where: {
      name_organizationId: {
        name: name,
        organizationId: currentOrganization.id,
      },
    },
  });

  if (isDepartmentDuplicate) {
    return new NextResponse(
      JSON.stringify({
        message: "Another department with the same name found.",
      }),
      { status: 400 },
    );
  }

  // Validate members
  // Check if all members are valid members
  const validMembers = await prisma.user.findMany({
    where: {
      id: { in: members.map((member) => member.id) },
      OrganizationMembership: {
        some: {
          organizationId: currentOrganization.id,
        },
      },
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
    // Step 1: Create the department
    const department = await prisma.department.create({
      data: {
        name: name,
        organizationId: currentOrganization.id,
      },
    });

    // Step 2: Associate users with the newly created department
    await Promise.all(
      validMembers.map((member) =>
        prisma.departmentMembership.create({
          data: {
            userId: member.id,
            departmentId: department.id,
            organizationId: currentOrganization.id,
          },
        }),
      ),
    );

    return new NextResponse(JSON.stringify(department), { status: 201 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 },
    );
  }
}
