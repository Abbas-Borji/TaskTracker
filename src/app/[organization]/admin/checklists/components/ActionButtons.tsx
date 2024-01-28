"use client";
import React, { useState } from "react";
import Link from "next/link";
import AssignmentModal from "@/app/common/components/AssignModal";
import { TrashIcon } from "@heroicons/react/24/outline";

interface ActionButtonsProps {
  checklistId: number;
  onDelete: (id: number) => void;
  organization: string;
}

const ActionButtons = ({
  checklistId,
  onDelete,
  organization,
}: ActionButtonsProps) => {
  // Assign Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
  };
  const handleDelete = () => {
    onDelete(checklistId);
  };
  const handleAssign = () => {
    setIsAssignModalOpen(true);
  };

  return (
    <>
      <AssignmentModal
        open={isAssignModalOpen}
        onClose={handleCloseAssignModal}
        checklistId={checklistId}
      />
      <div className="flex">
        <Link
          href={`/${organization}/admin/checklist/edit?checklistId=${checklistId}`}
          className="mr-4 px-2 font-medium text-primary"
        >
          Edit
        </Link>

        <button
          className="mr-4 px-2 font-medium text-primary"
          onClick={handleAssign}
        >
          Assign
        </button>

        <button onClick={() => handleDelete()}>
          <TrashIcon className="h-5 w-5 text-red-600" />
        </button>
      </div>
    </>
  );
};

export default ActionButtons;
