import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { currentOrganization, userRole } = await getServerSessionUserInfo();

  const userId = params.userId ? params.userId : null;

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
        DepartmentMembership: {
          select: {
            department: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const reshapedUser = {
      name: user?.name,
      email: user?.email,
      Department: {
        name: user?.DepartmentMembership[0]?.department.name,
      },
    };

    if (!user) {
      return new NextResponse("User not found.", { status: 404 });
    }

    return new NextResponse(JSON.stringify(reshapedUser), { status: 200 });
  } catch (error) {
    console.error("Request error", error);
    return new NextResponse("Internal Server Error.", { status: 500 });
  }
}
