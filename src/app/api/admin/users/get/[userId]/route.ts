import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  // Get the userId from the slug
  const userId = params.userId;
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;

  // Allow only admins to get user data
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

  // Return the user
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        role: true,
        Department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

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
