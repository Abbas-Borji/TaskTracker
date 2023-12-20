import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  XMarkIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface Question {
  body: string;
  options: string[];
}

interface HandleQuestionChangeProps {
  value: string;
  index: number;
}

interface HandleOptionChangeProps {
  questionIndex: number;
  optionIndex: number;
  value: string;
}

const ChecklistForm = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([
    { body: "", options: ["", ""] },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const exit = () => {
    router.back();
  };

  const handleQuestionChange = ({
    value,
    index,
  }: HandleQuestionChangeProps) => {
    const newQuestions = [...questions];
    newQuestions[index]!.body = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = ({
    questionIndex,
    optionIndex,
    value,
  }: HandleOptionChangeProps) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex]!.options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex]!.options.push("");
    setQuestions(newQuestions);
  };

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex]!.options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    const newQuestions = [...questions, { body: "", options: ["", ""] }];
    setQuestions(newQuestions);
    setCurrentQuestionIndex(newQuestions.length - 1); // Navigate to the new question
  };

  const deleteQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(newQuestions.length - 1);
  };

  const saveForm = () => {
    // Implement save logic
    console.log("Form data:", questions);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <div className="relative w-full rounded-lg border border-gray-300 bg-light">
        <div className="mb-10 mt-6">
          <h3 className="text-center text-2xl font-medium">Checklist 1</h3>
          <div className="absolute right-6 top-6">
            <button
              onClick={exit}
              className="flex items-center rounded bg-dark px-1 py-1 text-xs text-white hover:bg-orange-700"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-16">
          <div className="mb-6 flex justify-items-center">
            <button
              onClick={addQuestion}
              className="mb-2 me-2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-3.5 py-2 text-center text-sm font-medium text-white shadow-lg shadow-blue-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 dark:shadow-lg dark:shadow-blue-800/80 dark:focus:ring-blue-800"
            >
              Add Question
            </button>
            <button
              onClick={() => deleteQuestion(currentQuestionIndex)}
              disabled={questions.length <= 1} // Disable when there's only one question
              className={`my-auto ml-5 h-5 ${
                questions.length <= 1
                  ? "cursor-not-allowed text-gray-400"
                  : "text-gray-500 hover:text-red-800"
              }`}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
          <input
            type="text"
            value={currentQuestion!.body}
            onChange={(e) =>
              handleQuestionChange({
                value: e.target.value,
                index: currentQuestionIndex,
              })
            }
            className="mb-4 w-full rounded border border-gray-300 p-2 sm:w-3/4"
            placeholder="Enter a question here"
          />
          {currentQuestion!.options.map((option, index) => (
            <div key={index} className="mt-2 flex pr-6 sm:w-1/2 sm:pr-0">
              <input
                type="text"
                value={option}
                onChange={(e) =>
                  handleOptionChange({
                    questionIndex: currentQuestionIndex,
                    optionIndex: index,
                    value: e.target.value,
                  })
                }
                className="flex-1 rounded border border-gray-300 p-2 text-sm"
                placeholder={`Option ` + (index + 1)}
              />
              <button
                onClick={() => deleteOption(currentQuestionIndex, index)}
                disabled={index < 2} // Disable for the first two options
                className={`ml-2 ${
                  index < 2
                    ? "cursor-not-allowed text-gray-400"
                    : "text-gray-500 hover:text-red-800"
                }`}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addOption(currentQuestionIndex)}
            className="mb-2 me-2 mt-6 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >
            Add Option
          </button>
        </div>

        <div className="flex w-full items-center justify-between rounded-lg border-t border-gray-300 bg-dark p-4">
          <span className="text-white">
            <span className="sm:hidden">
              Q {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="hidden sm:inline">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </span>
          <div className="flex">
            <button
              disabled={currentQuestionIndex <= 0}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
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
              disabled={currentQuestionIndex >= questions.length - 1}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              className={`flex items-center justify-center rounded px-2 py-1 text-base shadow-sm transition-colors duration-200 sm:w-28 ${
                currentQuestionIndex >= questions.length - 1
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-primary text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              }`}
            >
              <span className="mr-2 hidden sm:inline">Next</span>
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={saveForm}
            className="rounded bg-green-500 px-6 py-2 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default ChecklistForm;
