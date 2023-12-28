import React from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

interface FormFooterProps {
  currentQuestionIndex: number;
  questionsLength: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: (parameter: any) => void;
}

const FormFooter: React.FC<FormFooterProps> = ({
  currentQuestionIndex,
  questionsLength,
  onPrevious,
  onNext,
  onSubmit,
}) => {
  return (
    <div className="flex w-full items-center justify-between rounded-lg border-t border-gray-300 bg-dark p-4">
      <span className="text-white">
        <span className="sm:hidden">
          Q {currentQuestionIndex + 1} of {questionsLength}
        </span>
        <span className="hidden sm:inline">
          Question {currentQuestionIndex + 1} of {questionsLength}
        </span>
      </span>
      <div className="flex">
        <button
          disabled={currentQuestionIndex <= 0}
          onClick={onPrevious}
          className={`mr-2 flex items-center justify-start rounded px-2 py-1 text-base shadow-sm transition-colors duration-200 sm:w-28 ${
            currentQuestionIndex <= 0
              ? "cursor-not-allowed bg-gray-400"
              : "bg-primary text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          }`}
        >
          <ChevronLeftIcon className="h-5 w-5" />
          <span className="ml-2 hidden sm:inline">Previous</span>
        </button>
        <button
          disabled={currentQuestionIndex >= questionsLength - 1}
          onClick={onNext}
          className={`flex items-center justify-center rounded px-2 py-1 text-base shadow-sm transition-colors duration-200 sm:w-28 ${
            currentQuestionIndex >= questionsLength - 1
              ? "cursor-not-allowed bg-gray-400"
              : "bg-primary text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          }`}
        >
          <span className="mr-2 hidden sm:inline">Next</span>
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      <button
        onClick={onSubmit}
        className="rounded bg-indigo-600 px-6 py-2 text-white"
      >
        Submit
      </button>
    </div>
  );
};

export default FormFooter;
