import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  console.log('URL:', url.href); // Log the full URL

  const teamId = url.pathname.split('/').pop(); // Extract the last segment of the pathname
  console.log('Team ID:', teamId); // Log the extracted teamId

  const prisma = new PrismaClient();

  const assignments = await prisma.assignment.findMany({
    where: {
      teamId: Number(teamId),
      employeeId: 1, // Constant user id for now, will be dynamic later based on Token
    },
  });

  const checklistIds = assignments.map(assignment => assignment.checklistId);

  const checklists = await prisma.checklist.findMany({
    where: {
      id: {
        in: checklistIds,
      },
    },
    include: {
      manager: true,
    },
  });

  const checklistNameWithManagerName = checklists.map(checklist => ({
    info: {
      id: checklist.id,
      name: checklist.name,
    },
    manager: {
      id: checklist.manager.id,
      name: checklist.manager.fullName,
    },
  }));

  return new NextResponse(JSON.stringify(checklistNameWithManagerName), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
