"use client";
import React, { useState, useEffect } from "react";
import Container from "@/app/common/components/Container";
import FormFooter from "@/app/common/components/FormFooter";
import { Question } from "@/app/common/types/CreateOrEditChecklist";
import { useRouter } from "next/navigation";
import Notification from "@/app/common/components/Notification";
import FormSkeleton from "@/app/common/components/FormSkeleton";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface SubmittedOption {
  optionId: number;
}

interface SubmissionProps {
  submissionId: number;
}

const Submission = ({ submissionId }: SubmissionProps) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<{
    [questionId: number]: number;
  }>({});

  useEffect(() => {
    //fetchQuestions();
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/submission/${submissionId}`);
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
  }, [submissionId]);

  return (
    <>
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
              onSubmit={() => {}}
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
                      checked={
                        selectedOptions[
                          questions![currentQuestionIndex]!.id!
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

export default Submission;
