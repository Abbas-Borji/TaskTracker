import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";

interface Department {
  id: number;
  name: string;
}

interface ProfileData {
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "MANAGER";
  Department: Department | null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Get the requested userId from the slug
  const requestedUserId = params.userId;

  // Allow only admins to update users
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

  // Parse the request body and validate the data
  const profileData: ProfileData = await request.json();

  // Validate name
  if (
    !profileData.name ||
    typeof profileData.name !== "string" ||
    profileData.name.length < 3
  ) {
    return new NextResponse(JSON.stringify({ message: "Invalid Name" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Validate email
  if (
    !profileData.email ||
    typeof profileData.email !== "string" ||
    !/^\S+@\S+\.\S+$/.test(profileData.email)
  ) {
    return new NextResponse(JSON.stringify({ message: "Invalid Email" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Validate role
  if (
    !profileData.role ||
    !["ADMIN", "MANAGER", "USER"].includes(profileData.role)
  ) {
    return new NextResponse(JSON.stringify({ message: "Invalid Role" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Update the user
  try {
    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: requestedUserId },
      data: {
        name: profileData.name,
        email: profileData.email,
        departmentId: profileData.Department ? profileData.Department.id : null,
      },
    });

    // Update the role in OrganizationMembership
    const updatedMembership = await prisma.organizationMembership.update({
      where: {
        userId_organizationId: {
          userId: requestedUserId,
          organizationId: currentOrganization.id,
        },
      },
      data: {
        role: profileData.role,
      },
    });

    return new NextResponse(JSON.stringify(updatedUser), {
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
