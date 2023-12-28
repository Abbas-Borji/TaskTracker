import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";
import prisma from "prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { submissionId: string } },
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  const userRole = session?.user.role;

  // Extract submission ID
  const submissionId = params.submissionId ? Number(params.submissionId) : null;

  if (!submissionId) {
    return new NextResponse("Submission ID is required", { status: 400 });
  }

  // Fetch submission with related assignment and its checklist
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      assignment: {
        include: { checklist: true },
      },
    },
  });

  if (!submission) {
    return new NextResponse("Submission not found", { status: 404 });
  }

  switch (userRole) {
    case "USER":
      // Check if the submission belongs to the user
      if (submission.userId === userId) {
        return new NextResponse(JSON.stringify(submission), { status: 200 });
      } else {
        return new NextResponse("Unauthorized access", { status: 403 });
      }

    case "MANAGER":
      // Check if the user is the manager in the checklist of the assignment
      if (submission.assignment?.checklist?.managerId === userId) {
        return new NextResponse(JSON.stringify(submission), { status: 200 });
      } else {
        return new NextResponse("Unauthorized access", { status: 403 });
      }

    case "ADMIN":
      // Admins have direct access
      return new NextResponse(JSON.stringify(submission), { status: 200 });

    default:
      return new NextResponse("Invalid user role", { status: 403 });
  }
}
