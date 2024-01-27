import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();
  // Get the requested userId from the slug
  const requestedUserId = params.userId;

  // Allow only admins to get user data
  if (userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 400 });
  }

  // Validate the userId
  if (!requestedUserId) {
    return new NextResponse(JSON.stringify({ message: "Invalid userId." }), {
      status: 400,
    });
  }

  // Check if the user exists
  const userExists = await prisma.user.findUnique({
    where: {
      id: requestedUserId,
    },
  });
  if (!userExists) {
    return new NextResponse(JSON.stringify({ message: "User not found." }), {
      status: 404,
    });
  }

  // Return the user
  try {
    const userWithRole = await prisma.user.findUnique({
      where: { id: requestedUserId },
      select: {
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

    const user = {
      name: userWithRole?.name,
      email: userWithRole?.email,
      role: userWithRole?.OrganizationMembership[0]?.role, // Each user has only one role per organization
      Department: userWithRole?.DepartmentMembership[0]?.department,
    };

    return new NextResponse(JSON.stringify(user), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 },
    );
  }
}
