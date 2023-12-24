import React from "react";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";

interface ActionButtonsProps {
  checklistId: number;
  onDelete: (id: number) => void;
}

const ActionButtons = ({ checklistId, onDelete }: ActionButtonsProps) => {

  const handleDelete = () => {
    onDelete(checklistId);
  };

  return (
    <div className="flex">
      <Link
        href={`/admin/checklist/edit?checklistId=` + checklistId}
        className="mr-4 px-2 font-medium text-primary"
      >
        Edit
      </Link>
      <Link href={"#"} className="mr-4 px-2 font-medium text-primary">
        Assign
      </Link>

      <button onClick={() => handleDelete()}>
        <TrashIcon className="h-5 w-5 text-red-600" />
      </button>
    </div>
  );
};

export default ActionButtons;
