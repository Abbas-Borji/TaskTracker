import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.SECRET });

  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const url = request.nextUrl;
  const email = decodeURIComponent(url.pathname.split("/").pop() ?? ""); // Extract the email from the URL

  try {
    // Query the user based on the email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Return the user's role
    return new NextResponse(JSON.stringify({ role: user.role }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
