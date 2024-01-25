import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";
import bcrypt from "bcrypt";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
 
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

   // Get the requested userId from the slug
   const requestedUserId = params.userId;

  // Allow only admins to update users
  if (userRole !== "ADMIN") {
    return new NextResponse("Permission denied.", { status: 400 });
  }

  // Validate the userId
  if (!requestedUserId) {
    return new NextResponse(JSON.stringify({ message: "Invalid userId." }), {
      status: 400,
    });
  }

  // Check if the user exists
  const userExists = await prisma.user.findUnique({
    where: {
      id: requestedUserId,
      OrganizationMembership: {
        some: {
          organizationId: currentOrganization.id,
        },
      },
    },
  });
  if (!userExists) {
    return new NextResponse(JSON.stringify({ message: "User not found." }), {
      status: 404,
    });
  }

  // Parse the request body and validate the data
  const newPassword: string = await request.json();

  // Validate the password
  if (!newPassword || newPassword.length < 3) {
    return new NextResponse(JSON.stringify({ message: "Invalid password." }), {
      status: 400,
    });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: requestedUserId,
        OrganizationMembership: {
          some: {
            organizationId: currentOrganization.id,
          },
        },
      },
      data: {
        password: hashedPassword,
      },
    });

    return new NextResponse(JSON.stringify(updatedUser), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 },
    );
  }
}
