import React from "react";
import { Checklist } from "@/app/common/types/Checklist";

interface ChecklistCardProps {
  checklist: Checklist;
  handleClick: (assignmentId: number) => void;
}

const ChecklistCard = ({ checklist, handleClick }: ChecklistCardProps) => {
  return (
    <>
      <div
        key={checklist.info.id}
        className="relative mb-4 rounded-lg bg-light p-4 shadow-md"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-bold">{checklist.info.name}</div>
            <div className="mt-2 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-gray-600">
              Assigned by: {checklist.manager.name}
            </div>
          </div>
          <button
            className={`${
              checklist.info.viewed ? "bg-success" : "bg-primary"
            } h-8 w-20 rounded px-2 py-1 text-xs font-medium text-light`}
            onClick={() => handleClick(checklist.info.id)}
          >
            {checklist.info.viewed ? "Continue" : "Start"}
          </button>
        </div>
        {/* Date at the bottom */}
        <div className="mt-2 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm italic text-gray-600">
          Due {checklist.info.dueDate}
        </div>
      </div>
    </>
  );
};

export default ChecklistCard;
