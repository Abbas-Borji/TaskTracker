import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse("User ID is required.", { status: 400 });
  }

  try {
    // Fetch user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        Department: {
          select: { name: true },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found.", { status: 404 });
    }

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Request error", error);
    return new NextResponse("Internal Server Error.", { status: 500 });
  }
}
