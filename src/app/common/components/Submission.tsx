"use client";
import Container from "@/app/common/components/Container";
import FormFooter from "@/app/common/components/FormFooter";
import FormSkeleton from "@/app/common/components/FormSkeleton";
import Notification from "@/app/common/components/Notification";
import { Question } from "@/app/common/types/ViewSubmission";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import GiveFeedbackModal from "./GiveFeedbackModal";

interface SubmissionProps {
  submissionId: number;
}

const Submission = ({ submissionId }: SubmissionProps) => {
  const session = useSession();
  const userRole = session.data?.user?.currentOrganization.role;
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<{
    [questionId: number]: number;
  }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasFeedback, setHasFeedback] = useState(false);

  useEffect(() => {
    if (userRole === "MANAGER" || userRole === "ADMIN") {
      updateStatus();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/submission/get/${submissionId}`);
        const data = await response.json();
        setTitle(data.checklistName);
        setQuestions(data.questionsWithOptions);
        setHasFeedback(data.hasFeedback);
        // Map the selectedOptionId from each question to its id
        const selectedOptionsMap: { [questionId: number]: number } = {};
        if (data.questionsWithOptions) {
          data.questionsWithOptions.forEach((question: Question) => {
            if (question.selectedOptionId !== null) {
              selectedOptionsMap[question.id] = question.selectedOptionId;
            }
          });
        }
        setSelectedOptions(selectedOptionsMap);
        if (!response.ok) {
          setServerError(data.message);
          setIsNotificationVisible(true);
          setTimeout(() => {
            setIsNotificationVisible(false);
            setServerError("");
          }, 1000);
        }
        setIsLoading(false);
      } catch (error: any) {
        setServerError(error.message);
        setIsNotificationVisible(true);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [submissionId]);

  const giveFeedback = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateStatus = async () => {
    try {
      const response = await fetch(`/api/submission/update/${submissionId}`, {
        method: "PATCH",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isNotificationVisible ? (
        serverError ? (
          <Notification
            title={serverError}
            body={"There was an error loading this submission."}
            icon={<ExclamationTriangleIcon className="text-red-600" />}
            show={isNotificationVisible}
            setShow={setIsNotificationVisible}
          />
        ) : null
      ) : null}
      {isLoading ? (
        <FormSkeleton />
      ) : (
        <>
          <GiveFeedbackModal
            open={isModalOpen}
            onClose={closeModal}
            submissionId={submissionId}
            checklistName={title}
          />
          <Container
            title={title}
            footer={
              <FormFooter
                currentQuestionIndex={currentQuestionIndex}
                questionsLength={questions ? questions.length : 0}
                onPrevious={() =>
                  setCurrentQuestionIndex(currentQuestionIndex - 1)
                }
                onNext={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                onSubmit={() => {
                  if (userRole === "USER") {
                    () => {};
                  } else if (userRole === "ADMIN" || userRole === "MANAGER") {
                    giveFeedback();
                  }
                }}
                buttonText={
                  userRole === "ADMIN" || userRole === "MANAGER"
                    ? "Give Feedback"
                    : undefined
                }
                disabled={
                  (userRole === "ADMIN" || userRole === "MANAGER") &&
                  !hasFeedback
                    ? false
                    : true
                }
              />
            }
          >
            <h3 className="mb-8 text-lg font-semibold">
              Question {currentQuestionIndex + 1} :{" "}
              <span className="font-normal">
                {questions && questions[currentQuestionIndex]?.content}
              </span>
            </h3>
            <div className="mb-14">
              <fieldset className="mt-4">
                <legend className="sr-only">Question Options</legend>
                <div className="space-y-6">
                  {questions?.[currentQuestionIndex]?.options?.map((option) => (
                    <div key={option.id} className="flex items-center">
                      <input
                        id={`option-${option.id}`}
                        name={`question-${questions[currentQuestionIndex]?.id}`}
                        type="radio"
                        className="h-4 w-4"
                        checked={
                          selectedOptions[
                            questions[currentQuestionIndex]?.id ?? -1
                          ] === option.id
                        }
                        readOnly
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
        </>
      )}
    </>
  );
};

export default Submission;
