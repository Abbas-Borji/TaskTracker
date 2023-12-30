import React from "react";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";

interface ActionButtonsProps {
  submissionId: number;
  onDelete: (id: number) => void;
}

const ActionButtons = ({ submissionId, onDelete }: ActionButtonsProps) => {
  const handleDelete = () => {
    onDelete(submissionId);
  };

  return (
    <div className="flex">
      <Link
        href={`/admin/submission/` + submissionId}
        className="mr-4 px-2 font-medium text-primary"
      >
        View
      </Link>

      <button onClick={() => handleDelete()}>
        <TrashIcon className="h-5 w-5 text-red-600" />
      </button>
    </div>
  );
};

export default ActionButtons;
