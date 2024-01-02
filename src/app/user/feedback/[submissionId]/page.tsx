"use client";
import Feedback from "@/app/common/components/Feedback";
import FeedbackSkeleton from "@/app/common/components/FeedbackSkeleton";
import Notification from "@/app/common/components/Notification";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import AllowOnlyUser from "@/app/common/functions/ClientAllowOnlyUser";

interface ResponseData {
  checklistName: string;
  feedbackContent: string;
  feedbackFormattedDate: string;
  managerName: string;
  managerImage?: string;
  message?: string;
}

const UserViewFeedbackPage = ({
  params,
}: {
  params: { submissionId: string };
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [checklistName, setChecklistName] = useState("");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackFormattedDate, setFeedbackFormattedDate] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerImage, setManagerImage] = useState("");
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [serverError, setServerError] = useState("");

  const submissionId = params.submissionId ? Number(params.submissionId) : null;
  useEffect(() => {
    if (submissionId) {
      setIsLoading(true);
      try {
        const fetchData = async () => {
          const response = await fetch("/api/feedback/get/" + submissionId);
          const data: ResponseData = await response.json();
          setChecklistName(data.checklistName);
          setFeedbackContent(data.feedbackContent);
          setFeedbackFormattedDate(data.feedbackFormattedDate);
          setManagerName(data.managerName);
          setManagerImage(data.managerImage || "");

          if (!response.ok) {
            setServerError(data.message!);
            setIsNotificationVisible(true);
            setTimeout(() => {
              setIsNotificationVisible(false);
              setServerError("");
            }, 1000);
          }
          setIsLoading(false);
        };
        fetchData();
      } catch (error: any) {
        setServerError(error.message);
        setIsNotificationVisible(true);
        setIsLoading(false);
      }
    }
  }, [submissionId]);

  return (
    <>
      <AllowOnlyUser />
      {isNotificationVisible ? (
        serverError ? (
          <Notification
            title={serverError}
            body="There was an error loading this feedback."
            icon={<ExclamationTriangleIcon className="text-red-600" />}
            show={isNotificationVisible}
            setShow={setIsNotificationVisible}
          />
        ) : null
      ) : null}
      {isLoading ? (
        <FeedbackSkeleton />
      ) : (
        <Feedback
          checklistName={checklistName}
          managerName={managerName}
          feedbackContent={feedbackContent}
          feedbackFormattedDate={feedbackFormattedDate}
          managerImage={managerImage}
        />
      )}
    </>
  );
};

export default UserViewFeedbackPage;
