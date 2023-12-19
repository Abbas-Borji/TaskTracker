import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";

const ChecklistForm = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState([{ body: "", options: ["", ""] }]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const exit = () => {
    router.back();
  };

  const handleQuestionChange = (e, index) => {
    const newQuestions = [...questions];
    newQuestions[index].body = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push("");
    setQuestions(newQuestions);
  };

  const deleteOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { body: "", options: ["", ""] }]);
  };

  const deleteQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
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
          <h3 className="mr-5 text-center text-2xl font-medium">Checklist 1</h3>
          <div className="absolute right-6 top-6">
            <button
              onClick={exit}
              className="flex items-center rounded bg-dark px-1 py-1 text-xs text-white hover:bg-orange-700"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-items-center mb-6">
            <button
              onClick={addQuestion}
              className="ml-2 rounded bg-blue-500 px-4 py-2 text-white"
            >
              Add Question
            </button>
            <button
              onClick={() => deleteQuestion(currentQuestionIndex)}
              className="ml-2 flex items-center justify-center rounded bg-red-500 px-1 text-white"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
          <input
            type="text"
            value={currentQuestion.body}
            onChange={(e) => handleQuestionChange(e, currentQuestionIndex)}
            className="w-full rounded border border-gray-300 p-2"
            placeholder="Question"
          />
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="mt-2 flex items-center">
              <input
                type="text"
                value={option}
                onChange={(e) =>
                  handleOptionChange(
                    currentQuestionIndex,
                    index,
                    e.target.value,
                  )
                }
                className="flex-1 rounded border border-gray-300 p-2"
                placeholder="Option"
              />
              <button
                onClick={() => deleteOption(currentQuestionIndex, index)}
                className="ml-2 flex items-center justify-center rounded bg-red-500 p-1 text-white"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addOption(currentQuestionIndex)}
            className="mt-6 flex items-center justify-center rounded bg-blue-500 px-4 py-2 text-white"
          >
            Add Option
          </button>
        </div>

        <div className="bottom-0 flex w-full items-center justify-between rounded-lg border-t border-gray-300 bg-dark p-4">
          <span className="text-white">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <div>
            {currentQuestionIndex > 0 && (
              <button
                onClick={() =>
                  setCurrentQuestionIndex(currentQuestionIndex - 1)
                }
                className="mr-4 rounded bg-gray-500 px-1 py-2 text-white w-24"
              >
                Previous
              </button>
            )}
            {currentQuestionIndex < questions.length - 1 && (
              <button
                onClick={() =>
                  setCurrentQuestionIndex(currentQuestionIndex + 1)
                }
                className="rounded bg-gray-500 px-1 py-2 text-white w-24"
              >
                Next
              </button>
            )}
          </div>
          <div>
            <button
              onClick={saveForm}
              className="rounded bg-green-500 px-6 py-2 text-white"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChecklistForm;
