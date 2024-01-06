import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";

interface ProfileEditableData {
  fullName: string;
  department: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  // Get the userId from the session
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  console.log("userId", userId);

  if (userId !== params.userId) {
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

  // Parse the request body
  const profileData: ProfileEditableData = await request.json();

  // Validate name
  if (!profileData.fullName || profileData.fullName.length < 3) {
    return new NextResponse(JSON.stringify({ message: "Invalid name." }), {
      status: 400,
    });
  }

  // Validate department
  if (!profileData.department || profileData.department.length < 3) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid department." }),
      {
        status: 400,
      },
    );
  }

  // Update the user
  try {
    // First, update the team's basic information
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: profileData.fullName,
        department: profileData.department,
      },
    });

    return new NextResponse(JSON.stringify(updatedUser), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.log(error.message);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 },
    );
  }
}
