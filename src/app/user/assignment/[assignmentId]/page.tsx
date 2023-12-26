"use client";
import React, { useState, useEffect } from "react";
import Container from "@/app/common/components/Container";
import FormFooter from "@/app/common/components/FormFooter";
import { Question } from "@/app/common/types/CreateOrEditChecklist";
import { useRouter } from "next/navigation";
import Notification from "@/app/common/components/Notification";
import FormSkeleton from "@/app/common/components/FormSkeleton";
import AllowOnlyUser from "@/app/common/functions/ClientAllowOnlyUser";

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
  //const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  const submitForm = async () => {};

  return (
    <>
      <AllowOnlyUser />
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
                {questions![currentQuestionIndex]!.options.map(
                  (option, index) => (
                    <div key={option.id} className="flex items-center">
                      <input
                        id={option.id!.toString()}
                        name="notification-method"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor={option.id!.toString()}
                        className="ml-3 block font-medium leading-6 text-gray-900"
                      >
                        {option.content}
                      </label>
                    </div>
                  ),
                )}
              </div>
            </fieldset>
          </div>
        </Container>
      )}
    </>
  );
};

export default FillChecklistForm;
