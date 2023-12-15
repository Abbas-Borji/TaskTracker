import React from "react";
import { ManagerChecklist } from "@/app/common/types/ManagerChecklist";

interface ManagerChecklistCardProps {
  checklist: ManagerChecklist;
}

const ManagerChecklistCard = ({ checklist }: ManagerChecklistCardProps) => {
  return (
    <>
      <div
        key={checklist.info.id}
        className="relative mb-4 rounded-lg bg-light p-4 shadow-md"
      >
        <div className="absolute right-6 top-2 rotate-90 transform cursor-pointer text-2xl text-gray-600 hover:text-gray-800">
          &#8942; {/* HTML entity for horizontal ellipsis */}
        </div>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="text-lg font-bold">{checklist.info.name}</div>
          </div>
        </div>
        {/* Date at the bottom */}
        <div className="mt-2 text-sm italic text-gray-600 overflow-hidden overflow-ellipsis whitespace-nowrap">
          Created at {checklist.info.createdAt}
        </div>
      </div>
    </>
  );
};

export default ManagerChecklistCard;
