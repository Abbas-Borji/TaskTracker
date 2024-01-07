import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  // Get the userId from the session
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;
  // Extract userId
  const userId = params.userId ? params.userId : null;

  // Permission check to ensure only admins can access this route
  if (userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 400 });
  }

  // Validate the userId if it exists
  if (userId) {
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      return new NextResponse(JSON.stringify({ message: "User not found." }), {
        status: 404,
      });
    }
    // Delete the user
    try {
      const user = await prisma.user.delete({
        where: { id: userId },
      });

      return new NextResponse(JSON.stringify(user), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ message: "Internal Server Error." }),
        { status: 500 },
      );
    }
  } else {
    return new NextResponse(
      JSON.stringify({ message: "User ID not provided." }),
      {
        status: 400,
      },
    );
  }
}
