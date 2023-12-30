import React from "react";
import { ManagerSubmission } from "@/app/common/types/ManagerSubmission";
import DropdownMenu from "@/app/common/components/DropdownMenu";

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
        <div className="absolute right-6 top-4 h-5 w-5">
          <DropdownMenu
            items={[
              {
                label: submission.status === "REVIEWED" ? "Open" : "Review",
                type: "link",
                href: `/manager/submission/` + submission.id,
              },
              {
                label: "Cancel",
                type: "button",
              },
            ]}
          />
        </div>
        {submission.checklistinfo && (
          <div className="mb-2 flex items-start justify-between">
            <div>
              <div className="flex items-center text-lg font-bold">
                {submission.checklistinfo.name}
                {submission.status === "REVIEWED" && (
                  <span className="ml-4 rounded bg-green-300 px-2 py-1 text-xs">
                    {submission.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Date at the bottom */}
        <div className="mt-2 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm italic text-gray-600">
          Submitted at {submission.submittedAt}
        </div>
      </div>
    </>
  );
};

export default SubmissionCard;
