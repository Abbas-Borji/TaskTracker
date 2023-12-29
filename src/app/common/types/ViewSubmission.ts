export interface Option {
  id: number;
  content: string;
}

export interface Question {
  id: number;
  content: string;
  options: Option[];
  selectedOptionId: number | null;
}

export interface SubmissionResponse {
  checklistName: string;
  questionsWithOptions: Question[];
  hasFeedback?: boolean;
}
