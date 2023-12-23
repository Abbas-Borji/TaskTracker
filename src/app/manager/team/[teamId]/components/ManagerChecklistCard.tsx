import React from "react";
import { ManagerChecklist } from "@/app/common/types/ManagerChecklist";
import DropdownMenu from "@/app/common/components/DropdownMenu";

interface ManagerChecklistCardProps {
  checklist: ManagerChecklist;
  onDelete: (id: number) => void;
}

const ManagerChecklistCard = ({
  checklist,
  onDelete,
}: ManagerChecklistCardProps) => {
  const colorOptions = [
    { bg: "bg-gray-50", text: "text-gray-600", ring: "ring-gray-500/10" },
    { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-600/10" },
    { bg: "bg-yellow-50", text: "text-yellow-800", ring: "ring-yellow-600/20" },
    { bg: "bg-green-50", text: "text-green-700", ring: "ring-green-600/20" },
    { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-700/10" },
    { bg: "bg-indigo-50", text: "text-indigo-700", ring: "ring-indigo-700/10" },
    { bg: "bg-purple-50", text: "text-purple-700", ring: "ring-purple-700/10" },
    { bg: "bg-pink-50", text: "text-pink-700", ring: "ring-pink-700/10" },
  ];

  const getRandomColor = () => {
    const randomColor =
      colorOptions[Math.floor(Math.random() * colorOptions.length)];
    return `${randomColor?.bg} ${randomColor?.text} ${randomColor?.ring}`;
  };
  const handleDelete = () => {
    onDelete(checklist.info.id);
  };
  return (
    <>
      <div
        key={checklist.info.id}
        className="relative mb-4 rounded-lg bg-light p-4 shadow-md"
      >
        <div className="absolute right-6 top-4 h-5 w-5">
          <DropdownMenu
            items={[
              {
                label: "Edit",
                type: "link",
                href:
                  `/manager/checklist/edit?checklistId=` + checklist.info.id,
              },
              { label: "Assign to", type: "link", href: "#" },
              {
                label: "Delete",
                type: "button",
                onClick: handleDelete,
              },
              {
                label: "Cancel",
                type: "button",
              },
            ]}
          />
        </div>

        <div className="mb-2 flex items-start justify-between">
          <div>
            <div className="text-lg font-bold">{checklist.info.name}</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-left">
            {/* Date at the bottom */}
            <div className="text-sm italic text-gray-600">
              Created at {checklist.info.createdAt}
            </div>
          </div>
          {checklist.info.teamName && (
            <div className="w-full text-right sm:w-24">
              {/* Team name */}
              <span
                className={`mt-4 inline-flex items-center rounded-md px-3 py-1 text-xs font-medium ring-1 ring-inset ${getRandomColor()}`}
              >
                {checklist.info.teamName}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ManagerChecklistCard;
