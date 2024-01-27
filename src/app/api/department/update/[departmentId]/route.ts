import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";

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
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

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

  // Check if department name is duplicated in this organization
  const departmentNameExists = await prisma.department.findFirst({
    where: {
      name: departmentData.name,
      organizationId: currentOrganization.id,
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
    where: {
      id: { in: memberIds },
      OrganizationMembership: {
        some: {
          organizationId: currentOrganization.id,
        },
      },
    },
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
    const existingMembers = await prisma.departmentMembership.findMany({
      where: {
        departmentId: departmentId,
        organizationId: currentOrganization.id,
      },
      select: {
        userId: true,
      },
    });

    const existingMemberIds = existingMembers.map((member) => member.userId);

    // Get the IDs of members to be removed
    const membersToRemove = existingMemberIds.filter(
      (id) => !memberIds.includes(id),
    );

    // Remove members no longer in the department
    if (membersToRemove.length > 0) {
      await prisma.departmentMembership.deleteMany({
        where: {
          departmentId: departmentId,
          userId: { in: membersToRemove },
        },
      });
    }

    // Add new members
    const newMemberIds = memberIds.filter(
      (id) => !existingMemberIds.includes(id),
    );
    if (newMemberIds.length > 0) {
      await Promise.all(
        newMemberIds.map(async (id) => {
          // Check if the user is already a member of a department in this organization
          const existingMembership =
            await prisma.departmentMembership.findUnique({
              where: {
                userId_organizationId: {
                  userId: id,
                  organizationId: currentOrganization.id,
                },
              },
            });

          if (existingMembership) {
            // Update existing membership
            return prisma.departmentMembership.update({
              where: {
                userId_organizationId: {
                  userId: id,
                  organizationId: currentOrganization.id,
                },
              },
              data: {
                departmentId: departmentId,
              },
            });
          } else {
            // Create new membership
            return prisma.departmentMembership.create({
              data: {
                departmentId: departmentId,
                userId: id,
                organizationId: currentOrganization.id,
              },
            });
          }
        }),
      );
    }

    // Prepare response
    const updatedDepartment = await prisma.department.findUnique({
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

    return new NextResponse(
      JSON.stringify({
        ...updatedDepartment,
        users: updatedDepartment?.DepartmentMembership.map((dm) => dm.user),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error: any) {
    console.error("Update department error:", error.message);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 },
    );
  }
}
