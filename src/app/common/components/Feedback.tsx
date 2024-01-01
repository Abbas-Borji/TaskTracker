import React from "react";
import Container from "./Container";

interface FeedbackProps {
  checklistName: string;
  feedbackContent: string;
  feedbackFormattedDate: string;
  managerName: string;
  managerImage?: string;
}

const Feedback = ({
  checklistName,
  feedbackContent,
  feedbackFormattedDate,
  managerName,
  managerImage,
}: FeedbackProps) => {
  return (
    <Container title={"Feedback for " + checklistName}>
      <div className="space-y-6 md:px-20 lg:px-48">
        <div className="flex flex-col sm:flex-row">
          <div className="order-2 mt-6 sm:ml-16 sm:mt-0">
            <div
              className="mt-3 space-y-6 text-base sm:text-lg text-gray-600"
              dangerouslySetInnerHTML={{ __html: feedbackContent }}
            />
          </div>

          <div className="order-1 flex items-center sm:flex-col sm:items-start">
            {managerImage ? (
              <img
                src={managerImage}
                alt={`${managerName}.`}
                className="h-20 w-20 rounded-full border-2 border-gray-600"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dark text-lg font-medium text-light sm:h-20 sm:w-20 sm:text-4xl">
                {managerName?.charAt(0) || "U"}
              </div>
            )}

            <div className="ml-4 sm:ml-0 sm:mt-4">
              <p className="text-sm font-medium text-gray-900">{managerName}</p>
              <div className="mt-2 flex items-center">
                <span className="text-sm text-gray-500">
                  {feedbackFormattedDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Feedback;
