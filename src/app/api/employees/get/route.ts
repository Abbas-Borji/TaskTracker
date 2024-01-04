import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user.role;

  // Allow only ADMINs
  if (userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 403 });
  }

  try {
    const employees = await prisma.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        name: true,
      },
    });

    const managers = await prisma.user.findMany({
      where: { role: "MANAGER" },
      select: {
        id: true,
        name: true,
      },
    });

    const response = {
      employees,
      managers,
    };

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
