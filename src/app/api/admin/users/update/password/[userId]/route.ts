import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import bcrypt from "bcrypt";

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
  const newPassword: string = await request.json();

  // Validate the password
  if (!newPassword || newPassword.length < 3) {
    return new NextResponse(JSON.stringify({ message: "Invalid password." }), {
      status: 400,
    });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
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