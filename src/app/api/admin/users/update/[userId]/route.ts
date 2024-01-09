import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import bcrypt from "bcrypt";

interface Department {
  id: number;
  name: string;
}

interface ProfileData {
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "MANAGER";
  department: Department | null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  // Get the userId from the slug
  const userId = params.userId;
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;

  // Allow only admins to update users
  if (userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 400 });
  }

  // Validate the userId
  if (!userId) {
    return new NextResponse(JSON.stringify({ message: "Invalid userId." }), {
      status: 400,
    });
  }

  // Check if the user exists
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
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
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: profileData.name,
        email: profileData.email,
        role: profileData.role,
        departmentId: profileData.department?.id,
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
