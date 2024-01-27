import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";

interface ProfileEditableData {
  fullName: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const userId = params.userId ? params.userId : null;

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

  // Update the user
  try {
    // First, update the team's basic information
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: profileData.fullName,
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
