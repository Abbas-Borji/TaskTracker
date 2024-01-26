import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";

export async function DELETE(request: NextRequest) {
  // Get the userRole from the session
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();
  // Extract checklistId from the query parameter, if present
  const url = request.nextUrl;
  const checklistIdQuery = url.searchParams.get("checklistId");
  const checklistId = checklistIdQuery ? Number(checklistIdQuery) : null;

  // Permission check to ensure only admins and managers can access this route
  if (userRole === "USER") {
    return new NextResponse("Permission denied.", { status: 400 });
  }

  // Validate the checklistId if it exists
  if (checklistId) {
    const checklistExists = await prisma?.checklist.findUnique({
      where: { id: checklistId },
    });
    if (!checklistExists) {
      return new NextResponse(
        JSON.stringify({ message: "Checklist not found." }),
        {
          status: 404,
        },
      );
    }
    // Delete the checklist
    try {
      const checklist = await prisma.checklist.delete({
        where: { id: checklistId },
      });

      return new NextResponse(JSON.stringify(checklist), {
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
      JSON.stringify({ message: "Checklist ID not provided." }),
      {
        status: 400,
      },
    );
  }
}
