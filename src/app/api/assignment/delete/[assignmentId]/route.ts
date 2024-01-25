import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { assignmentId: string } },
) {
  // Get the userRole from the session
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Extract assignmentId
  const assignmentId = params.assignmentId ? Number(params.assignmentId) : null;

  // Permission check to ensure only admins can access this route
  if (userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 400 });
  }

  // Validate the assignmentId if it exists
  if (assignmentId) {
    const assignmentExists = await prisma.assignment.findUnique({
      where: { id: assignmentId, organizationId: currentOrganization.id },
    });
    if (!assignmentExists) {
      return new NextResponse(
        JSON.stringify({ message: "Assignment not found." }),
        {
          status: 404,
        },
      );
    }
    // Delete the assignment
    try {
      const assignment = await prisma.assignment.delete({
        where: { id: assignmentId, organizationId: currentOrganization.id },
      });

      return new NextResponse(JSON.stringify(assignment), {
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
      JSON.stringify({ message: "Assignment ID not provided." }),
      {
        status: 400,
      },
    );
  }
}
