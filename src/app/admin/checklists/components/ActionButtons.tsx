import React from "react";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";

interface ActionButtonsProps {
  checklistId: number;
}

const ActionButtons = ({ checklistId }: ActionButtonsProps) => {
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

      <Link href={"#"}>
        <TrashIcon className="h-5 w-5 text-red-600" />
      </Link>
    </div>
  );
};

export default ActionButtons;
