import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { departmentId: string } },
) {
  // Get the userRole from the session
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Extract departmentId from URL
  const departmentId = params.departmentId ? Number(params.departmentId) : null;

  // Permission check to ensure only admins can access this route
  if (userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 400 });
  }

  // Validate the department
  if (departmentId) {
    const departmentExists = await prisma.department.findUnique({
      where: { id: departmentId },
    });
    if (!departmentExists) {
      return new NextResponse(JSON.stringify({ message: "Department not found." }), {
        status: 404,
      });
    }
    // Delete the department
    try {
      const department = await prisma.department.delete({
        where: { id: departmentId },
      });

      return new NextResponse(JSON.stringify(department), {
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
      JSON.stringify({ message: "Department ID is not provided." }),
      {
        status: 400,
      },
    );
  }
}
