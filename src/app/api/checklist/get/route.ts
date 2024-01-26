import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";

export async function GET(request: NextRequest) {
  // Get the user role from the session
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Permission check to ensure only admins and managers can access this route
  if (userRole === "USER") {
    return new NextResponse("Permission denied.", { status: 400 });
  }

  // Extract checklistId from the query parameter
  const url = request.nextUrl;
  const checklistIdQuery = url.searchParams.get("checklistId");
  const checklistId = checklistIdQuery ? Number(checklistIdQuery) : null;

  // Validate the checklistId
  if (!checklistId) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid checklistId." }),
      {
        status: 400,
      },
    );
  }

  // Check if the checklist exists
  const checklist = await prisma.checklist.findUnique({
    where: { id: checklistId },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  if (!checklist) {
    return new NextResponse(
      JSON.stringify({ message: "Checklist not found." }),
      {
        status: 404,
      },
    );
  }

  return new NextResponse(JSON.stringify(checklist), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
