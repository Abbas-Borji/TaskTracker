export interface Checklist {
  id?: number;
  name: string;
  managerId: string; // This would be provided, e.g., from the authenticated user's session
  teamId?: number | null; // Optional and can be null
  questions: Question[];
}

export interface Question {
  id?: number;
  content: string;
  options: Option[];
}

export interface Option {
  id?: number;
  content: string;
}
