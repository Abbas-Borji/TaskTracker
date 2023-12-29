import React from "react";

const FormSkeleton = () => {
  return (
    <div className="relative w-full select-none rounded-lg border border-gray-300 bg-light text-transparent">
      <div className="mb-10">
        <div className="absolute right-6 top-6">
          {/* Placeholder for button */}
          <div className="flex  items-center rounded bg-dark px-1 py-1 text-xs">
            <div className="h-4 w-4 animate-pulse bg-gray-300"></div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-16">
        <div className="mb-6">
          {/* Placeholder for input */}
          <div className="lg:1/4 mb-4 w-full animate-pulse rounded border border-gray-300 bg-gray-300 p-2 sm:w-1/2 md:w-1/3">
            Checklist Name
          </div>
        </div>
        <div className="mb-6 flex animate-pulse justify-items-center">
          {/* Placeholders for buttons */}
          <div className="mb-2 me-2 animate-pulse rounded-lg bg-gray-300 px-3.5 py-2 text-center text-sm font-medium shadow-lg">
            Add Question
          </div>
          <div className="my-auto ml-2 h-5 w-5 animate-pulse rounded-lg bg-gray-300"></div>
        </div>
        {/* Placeholder for input */}
        <div className="mb-4 w-full animate-pulse rounded border border-gray-300 bg-gray-300 p-2 sm:w-3/4">
          Enter a question
        </div>
        {/* Placeholder for options */}
        {[...Array(2)].map((_, index) => (
          <div key={index} className="mt-2 flex pr-6 sm:w-1/2 sm:pr-0">
            <div className="flex-1 animate-pulse rounded border border-gray-300 bg-gray-300 p-2 text-sm">
              Option
            </div>
            <div className="my-auto ml-2 h-4 w-4 animate-pulse rounded-lg bg-gray-300"></div>
          </div>
        ))}
        {/* Placeholder for Add Option button */}
        <div className="mb-2 me-2 mt-6 w-fit  animate-pulse rounded-lg border border-gray-300 bg-gray-300 px-3 py-1.5 text-sm">
          Add option
        </div>
      </div>

      <div className="flex w-full items-center justify-between rounded-lg border-t border-gray-300 bg-dark p-4">
        {/* Placeholder for footer content */}
        <span className="text-white">Question</span>
        <div className="flex">
          <div
            className={`mr-2 flex w-10 animate-pulse items-center justify-start overflow-hidden rounded bg-gray-300 px-2 py-1 text-base shadow-sm sm:w-20`}
          >
            Previous
          </div>
          <div
            className={`flex w-10 animate-pulse items-center justify-center overflow-hidden rounded bg-gray-300 px-2 py-1 text-base shadow-sm sm:w-20`}
          >
            Next
          </div>
        </div>

        <div className="animate-pulse rounded bg-gray-300 px-6 py-2">
          Submit
        </div>
      </div>
    </div>
  );
};

export default FormSkeleton;
