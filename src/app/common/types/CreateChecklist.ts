export interface Checklist {
  name: string;
  managerId: string; // This would be provided, e.g., from the authenticated user's session
  teamId?: number | null; // Optional and can be null
  questions: Question[];
}

export interface Question {
  content: string;
  checklistId?: number; // This will be set when the question is added to a checklist
  options: Option[];
}

export interface Option {
  content: string;
  questionId?: number; // Set when the option is linked to a question
}
