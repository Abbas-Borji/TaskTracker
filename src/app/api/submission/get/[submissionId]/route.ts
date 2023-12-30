import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "prisma/client";
import {
  Question,
  Option,
  SubmissionResponse,
} from "@/app/common/types/ViewSubmission";

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
    return new NextResponse("Submission ID is required.", { status: 400 });
  }

  // Fetch submission with its assignment and checklist
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      assignment: {
        include: {
          checklist: {
            include: {
              questions: {
                include: {
                  options: true,
                },
              },
            },
          },
          feedback: true,
        },
      },
      SubmittedOptions: true,
    },
  });

  if (!submission) {
    return new NextResponse("Submission not found", { status: 404 });
  }

  const getSubmissionInfo = async () => {
    try {
      const questions = await prisma.question.findMany({
        where: {
          id: {
            in: submission.assignment.checklist.questions.map(
              (question) => question.id,
            ),
          },
        },
        include: {
          options: true,
        },
      });

      // Get user selected options in this submission
      const selectedOptions = await prisma.option.findMany({
        where: {
          id: {
            in: submission.SubmittedOptions.map(
              (submittedOption) => submittedOption.optionId,
            ),
          },
        },
      });

      // Return each question with its options and selected option
      const questionsWithOptions = questions.map((question) => {
        // Find the selected option for this question
        const selectedOption = selectedOptions.find(
          (option) => option.questionId === question.id,
        );

        return {
          ...question,
          options: question.options,
          selectedOptionId: selectedOption ? selectedOption.id : null,
        };
      });

      // Has feedback boolean
      const hasFeedback = Boolean(submission.assignment.feedback);

      // Get checklist name
      const checklistName = submission.assignment.checklist.name;

      // Structure the response data
      const finalResult: SubmissionResponse = {
        checklistName,
        questionsWithOptions: questionsWithOptions.map((question) => ({
          id: question.id,
          content: question.content,
          options: question.options.map((option) => ({
            id: option.id,
            content: option.content,
          })),
          selectedOptionId: question.selectedOptionId,
        })),
        hasFeedback,
      };
      return new NextResponse(JSON.stringify(finalResult), { status: 200 });
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ message: "Internal Server Error." }),
        { status: 500 },
      );
    }
  };

  switch (userRole) {
    case "USER":
      // Check if the submission belongs to the user
      if (submission.userId === userId) {
        return await getSubmissionInfo();
      } else {
        return new NextResponse("Unauthorized access.", { status: 403 });
      }
      break;

    case "MANAGER":
      // Check if the user is the manager of the corresponding checklist
      if (submission.assignment?.checklist?.managerId === userId) {
        return await getSubmissionInfo();
      } else {
        return new NextResponse("Unauthorized access.", { status: 403 });
      }
      break;

    case "ADMIN":
      // Admins have direct access
      return await getSubmissionInfo();
      break;

    default:
  }
}
