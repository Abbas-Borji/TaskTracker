import React from "react";
import { ManagerSubmission } from "@/app/common/types/ManagerSubmission";

interface SubmissionCardProps {
  submission: ManagerSubmission;
}

const SubmissionCard = ({ submission }: SubmissionCardProps) => {
  return (
    <>
      <div
        key={submission.id}
        className="relative mb-4 rounded-lg bg-light p-4 shadow-md"
      >
        {/* Ellipsis Icon */}
        <div className="absolute right-6 top-2 rotate-90 transform cursor-pointer text-2xl text-gray-600 hover:text-gray-800">
          &#8942; {/* HTML entity for horizontal ellipsis */}
        </div>
        {submission.checklistinfo && (
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center text-lg font-bold">
                {submission.checklistinfo.name}
                {submission.status === "REVIEWED" && (
                  <span
                    className='ml-4 rounded px-2 py-1 text-xs bg-green-300'
                  >
                    {submission.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Date at the bottom */}
        <div className="mt-2 text-sm italic text-gray-600 overflow-hidden overflow-ellipsis whitespace-nowrap">
          Submitted at {submission.submittedAt}
        </div>
      </div>
    </>
  );
};

export default SubmissionCard;
