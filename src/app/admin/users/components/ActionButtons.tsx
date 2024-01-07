"use client";
import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

interface ActionButtonsProps {
  userId: string;
  onDelete: (id: string) => void;
}

const ActionButtons = ({ userId, onDelete }: ActionButtonsProps) => {
  const handleDelete = () => {
    onDelete(userId);
  };
  return (
    <div className="flex">
      <button onClick={() => handleDelete()}>
        <TrashIcon className="h-5 w-5 text-red-600" />
      </button>
    </div>
  );
};

export default ActionButtons;
