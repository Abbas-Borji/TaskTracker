import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { feedbackId: string } },
) {
  // Get the userId from the session
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;
  // Extract feedbackId
  const feedbackId = params.feedbackId ? Number(params.feedbackId) : null;

  // Permission check to ensure only admins can access this route
  if (userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 400 });
  }

  // Validate the feedbackId if it exists
  if (feedbackId) {
    const feedbackExists = await prisma.feedback.findUnique({
      where: { id: feedbackId },
    });
    if (!feedbackExists) {
      return new NextResponse(
        JSON.stringify({ message: "Feedback not found." }),
        {
          status: 404,
        },
      );
    }
    // Delete the feedback
    try {
      const feedback = await prisma.feedback.delete({
        where: { id: feedbackId },
      });

      return new NextResponse(JSON.stringify(feedback), {
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
      JSON.stringify({ message: "Feedback ID not provided." }),
      {
        status: 400,
      },
    );
  }
}
