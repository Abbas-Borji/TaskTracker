import React from "react";

const CardSkeleton = () => {
  return (
    <div className="relative mb-4 animate-pulse rounded-lg bg-light p-4 shadow-md">
      <div className="flex items-start justify-between">
        {/* Placeholder for the main text or title */}
        <div className="mb-2 h-8 w-1/4 rounded bg-gray-300"></div>

        {/* Placeholder for the action button */}
        <div className="h-8 w-20 rounded bg-gray-300"></div>
      </div>

      {/* Placeholder for the manager's name */}
      <div className="mt-2 h-3 w-1/2 rounded bg-gray-300"></div>
      {/* Placeholder for the date */}
      <div className="mt-3 h-3 w-2/3 rounded bg-gray-300"></div>
    </div>
  );
};

export default CardSkeleton;
