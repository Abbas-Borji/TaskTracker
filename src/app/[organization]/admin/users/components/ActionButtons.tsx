"use client";
import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

interface ActionButtonsProps {
  userId: string;
  onEdit: (id: string) => void;
  onChangePassword: (id: string) => void;
  onDelete: (id: string) => void;
}

const ActionButtons = ({
  userId,
  onEdit,
  onChangePassword,
  onDelete,
}: ActionButtonsProps) => {
  const handleDelete = () => {
    onDelete(userId);
  };
  const handleEdit = () => {
    onEdit(userId);
  };
  const handleChangePassword = () => {
    onChangePassword(userId);
  };
  return (
    <div className="flex">
      <button
        onClick={() => {
          handleEdit();
        }}
        className="mr-4 px-2 font-medium text-primary"
      >
        Edit
      </button>

      <button
        onClick={() => {
          handleChangePassword();
        }}
        className="mr-4 px-2 font-medium text-primary"
      >
        Change Password
      </button>

      <button onClick={() => handleDelete()}>
        <TrashIcon className="h-5 w-5 text-red-600" />
      </button>
    </div>
  );
};

export default ActionButtons;
