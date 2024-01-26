import { getServerSessionUserInfo } from "@/app/common/functions/getServerSessionUserInfo";
import {
  Checklist,
  Option,
  Question,
} from "@/app/common/types/CreateOrEditChecklist";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/client";

export async function PATCH(request: NextRequest) {
  // Get the user role from the session
  const { userId, currentOrganization, userRole } =
    await getServerSessionUserInfo();

  // Permission check to ensure only managers can access this route
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
  const checklistExists = await prisma.checklist.findUnique({
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

  // Parse the request body
  const checklistData: Checklist = await request.json();

  // Update the checklist
  try {
    // First, update the checklist's basic information
    const updatedChecklist = await prisma.checklist.update({
      where: { id: checklistId },
      data: {
        name: checklistData.name,
      },
    });

    // Fetch existing questions for this checklist
    const existingQuestions = await prisma.question.findMany({
      where: { checklistId: checklistId },
      include: { options: true },
    });

    // IDs of questions and options in the request
    const requestQuestionIds = new Set(
      checklistData.questions.map((q) => q.id),
    );
    const requestOptionIds = new Set(
      checklistData.questions.flatMap((q) => q.options.map((o) => o.id)),
    );

    // Delete questions and options not present in the request
    for (const question of existingQuestions) {
      if (!requestQuestionIds.has(question.id)) {
        await prisma.question.delete({ where: { id: question.id } });
      } else {
        const existingOptionIds = question.options.map((o) => o.id);
        for (const optionId of existingOptionIds) {
          if (!requestOptionIds.has(optionId)) {
            await prisma.option.delete({ where: { id: optionId } });
          }
        }
      }
    }

    const isNewQuestion = (question: Question) => !question.id;
    const isNewOption = (option: Option) => !option.id;

    // Update questions
    for (const question of checklistData.questions) {
      if (isNewQuestion(question)) {
        // Create a new question
        await prisma.question.create({
          data: {
            content: question.content,
            checklistId: checklistId,
            options: {
              create: question.options.map((o) => ({
                content: o.content,
              })),
            },
          },
        });
      } else {
        // Update existing question and handle its options
        await prisma.question.update({
          where: { id: question.id },
          data: {
            content: question.content,
          },
          include: {
            options: true,
          },
        });

        // Update options
        for (const option of question.options) {
          if (isNewOption(option)) {
            // Create a new option
            await prisma.option.create({
              data: {
                content: option.content!,
                questionId: question.id!,
              },
            });
          } else {
            // Update existing option
            await prisma.option.update({
              where: { id: option.id },
              data: {
                content: option.content,
              },
            });
          }
        }
      }
    }

    return new NextResponse(JSON.stringify(updatedChecklist), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.log(error.message);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 },
    );
  }
}
