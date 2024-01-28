import React from "react";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";

interface ActionButtonsProps {
  assignmentId: number;
  checklistId: number;
  onDelete: (id: number) => void;
  organization: string;
}

const ActionButtons = ({
  assignmentId,
  checklistId,
  onDelete,
  organization,
}: ActionButtonsProps) => {
  const handleDelete = () => {
    onDelete(assignmentId);
  };
  return (
    <div className="flex">
      <Link
        href={`/${organization}/admin/checklist/edit?checklistId=${checklistId}`}
        className="mr-4 px-2 font-medium text-primary"
      >
        Edit Checklist
      </Link>

      <button onClick={() => handleDelete()}>
        <TrashIcon className="h-5 w-5 text-red-600" />
      </button>
    </div>
  );
};

export default ActionButtons;
