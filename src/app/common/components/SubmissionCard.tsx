import React from "react";
import { Submission } from "@/app/common/types/Submission";
import DropdownMenu, { MenuItem } from "./DropdownMenu";

interface SubmissionCardProps {
  submission: Submission;
}

const SubmissionCard = ({ submission }: SubmissionCardProps) => {
  const items: MenuItem[] = [
    {
      label: "Open",
      type: "link",
      href: `/user/submission/` + submission.id,
    },
    {
      label: "Cancel",
      type: "button",
    },
  ];
  const reviewedItems: MenuItem[] = [
    {
      label: "Open",
      type: "link",
      href: `/user/submission/` + submission.id,
    },
    {
      label: "View Feedback",
      type: "link",
      href: `/user/feedback/` + submission.id,
    },
    {
      label: "Cancel",
      type: "button",
    },
  ];
  return (
    <>
      <div
        key={submission.id}
        className="relative mb-4 rounded-lg bg-light p-4 shadow-md"
      >
        <div className="absolute right-6 top-4 h-5 w-5">
          <DropdownMenu
            items={submission.status === "REVIEWED" ? reviewedItems : items}
          />
        </div>
        {submission.checklistinfo && (
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center text-lg font-bold">
                {submission.checklistinfo.name}
                <span
                  className={`ml-4 rounded px-2 py-1 text-xs ${
                    submission.status === "PENDING"
                      ? "bg-red-300"
                      : submission.status === "OPENED"
                        ? "bg-yellow-300"
                        : submission.status === "REVIEWED"
                          ? "bg-green-300"
                          : ""
                  }`}
                >
                  {submission.status}
                </span>
              </div>
              <div className="mt-2 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-gray-600">
                Assigned by: {submission.checklistinfo.managerName}
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
