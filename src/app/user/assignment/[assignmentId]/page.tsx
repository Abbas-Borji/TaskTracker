"use client";
import React, { useState, useEffect } from "react";
import Container from "@/app/common/components/Container";
import FormFooter from "@/app/common/components/FormFooter";
import { Question } from "@/app/common/types/CreateOrEditChecklist";
import { useRouter } from "next/navigation";
import Notification from "@/app/common/components/Notification";
import FormSkeleton from "@/app/common/components/FormSkeleton";
import AllowOnlyUser from "@/app/common/functions/ClientAllowOnlyUser";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface Submission {
  userId?: string;
  assignmentId?: number;
  submittedOptions: SubmittedOption[];
}

interface SubmittedOption {
  optionId: number;
}

const FillChecklistForm = ({
  params,
}: {
  params: { assignmentId: string };
}) => {
  const router = useRouter();
  const assignmentId = params.assignmentId ? Number(params.assignmentId) : null;
  const [title, setTitle] = useState("");
  const initialQuestions: Question[] = [
    {
      id: 1,
      content: "",
      options: [
        { id: 1, content: "" },
        { id: 2, content: "" },
      ],
    },
  ];
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<{
    [questionId: number]: number;
  }>({});

  const handleOptionChange = (questionId: number, optionId: number) => {
    setSelectedOptions((prev) => {
      const newSelectedOptions = { ...prev, [questionId]: optionId };
      console.log("New Selected Options:", newSelectedOptions);
      return newSelectedOptions;
    });
  };

  useEffect(() => {
    //fetchQuestions();
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/user/assignment/${assignmentId}`);
        const data = await response.json();
        setTitle(data.title);
        setQuestions(data.questions);
        setIsLoading(false);
      } catch (error: any) {
        setServerError(error.message);
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [assignmentId]);

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Check if an option has been selected for each question
    const isEveryQuestionAnswered = questions.every((question) =>
      selectedOptions.hasOwnProperty(question!.id!),
    );

    if (!isEveryQuestionAnswered) {
      // Show an error message
      setServerError("Please answer all questions.");
      setIsNotificationVisible(true);
      setTimeout(() => {
        setIsNotificationVisible(false);
        setIsLoading(false);
        setServerError("");
      }, 1000);
      return;
    }

    const submissionData: Submission = {
      submittedOptions: Object.entries(selectedOptions).map(
        ([questionId, optionId]) => ({
          optionId,
        }),
      ),
    };

    try {
      const response = await fetch(
        `/api/user/submission/create/${assignmentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        },
      );
      if (response.ok) {
        setIsNotificationVisible(true);
        setTimeout(() => {
          setIsNotificationVisible(false);
          setIsLoading(false);
          router.back();
        }, 1000);
      } else {
        const errorMessage = await response.text();
        setServerError(errorMessage);
        setIsNotificationVisible(true);
        setIsLoading(false);
      }
    } catch (error: any) {
      setServerError(error.message);
      setIsNotificationVisible(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      <AllowOnlyUser />
      {isNotificationVisible ? (
        serverError ? (
          <Notification
            title={serverError}
            body={"There was an error submitting this assignment."}
            icon={<ExclamationTriangleIcon className="text-red-600" />}
            show={isNotificationVisible}
            setShow={setIsNotificationVisible}
          />
        ) : (
          <Notification
            title="Assignment Submitted"
            body={"You have successfully submitted this assignment."}
            icon={<CheckCircleIcon className="text-green-400" />}
            show={isNotificationVisible}
            setShow={setIsNotificationVisible}
          />
        )
      ) : null}
      {isLoading ? (
        <FormSkeleton />
      ) : (
        <Container
          title={title}
          footer={
            <FormFooter
              currentQuestionIndex={currentQuestionIndex}
              questionsLength={questions!.length}
              onPrevious={() =>
                setCurrentQuestionIndex(currentQuestionIndex - 1)
              }
              onNext={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              onSubmit={submitForm}
            />
          }
        >
          <h3 className="mb-8 text-lg font-semibold">
            Question {currentQuestionIndex + 1} :{" "}
            <span className="font-normal">
              {questions![currentQuestionIndex]!.content}
            </span>
          </h3>
          <div className="mb-14">
            <fieldset className="mt-4">
              <legend className="sr-only">Question Options</legend>
              <div className="space-y-6">
                {questions![currentQuestionIndex]!.options.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <input
                      id={`option-${option.id}`}
                      name={`question-${questions![currentQuestionIndex]!.id}`}
                      type="radio"
                      className="h-4 w-4"
                      onChange={() =>
                        handleOptionChange(
                          questions[currentQuestionIndex]!.id!,
                          option.id!,
                        )
                      }
                      checked={
                        selectedOptions[
                          questions[currentQuestionIndex]!.id!
                        ] === option.id
                      }
                    />
                    <label htmlFor={`option-${option.id}`} className="ml-3">
                      {option.content}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
        </Container>
      )}
    </>
  );
};

export default FillChecklistForm;
