import React from "react";

interface BadgeProps {
  label: string;
  onRemove: () => void;
}

const Badge = ({ label, onRemove }: BadgeProps) => {
  return (
    <span className="inline-flex m-1 items-center gap-x-0.5 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
      {label}
      <button
        type="button"
        className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20"
        onClick={onRemove}
      >
        <span className="sr-only">Remove</span>
        <svg
          viewBox="0 0 14 14"
          className="h-3.5 w-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
        >
          <path d="M4 4l6 6m0-6l-6 6" />
        </svg>
        <span className="absolute -inset-1" />
      </button>
    </span>
  );
};

export default Badge;
