"use client";
import React, { useState, useEffect } from "react";
import Container from "@/app/common/components/Container";
import FormFooter from "@/app/common/components/FormFooter";
import { Checklist, Question } from "@/app/common/types/CreateOrEditChecklist";

interface FillChecklistFormProps {
  initialChecklist?: Checklist; // include the entire checklist if in edit mode
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

const FillChecklistForm = (
  { params }: { params: { checklistId: string } },
  { initialChecklist }: FillChecklistFormProps,
) => {
  const checklistId = params.checklistId ? Number(params.checklistId) : null;
  const initialQuestions: Question[] = [
    {
      content: "",
      options: [{ content: "" }, { content: "" }],
    },
  ];
  const [questions, setQuestions] = useState<Question[]>(
    initialChecklist ? initialChecklist.questions : initialQuestions,
  );
  const [checklistName, setChecklistName] = useState(
    initialChecklist ? initialChecklist.name : "",
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleQuestionChange = ({
    value,
    index,
  }: HandleQuestionChangeProps) => {
    const newQuestions = [...questions];
    newQuestions[index]!.content = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = ({
    questionIndex,
    optionIndex,
    value,
  }: HandleOptionChangeProps) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex]!.options[optionIndex]!.content = value;
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex]!.options.push({ content: "" });
    setQuestions(newQuestions);
  };

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex]!.options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    const newQuestion = {
      content: "",
      options: [{ content: "" }, { content: "" }],
    };

    const newQuestions = [...questions, newQuestion];
    setQuestions(newQuestions);
    setCurrentQuestionIndex(newQuestions.length - 1); // Navigate to the new question
  };

  const deleteQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(newQuestions.length - 1);
  };

  const submitForm = async () => {};

  return (
    <Container
      title="Checklist 1"
      footer={
        <FormFooter
          currentQuestionIndex={currentQuestionIndex}
          questionsLength={questions.length}
          onPrevious={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          onNext={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
          onSubmit={submitForm}
        />
      }
    >
      <p>Checklist Filling Form Body</p>
    </Container>
  );
};

export default FillChecklistForm;
