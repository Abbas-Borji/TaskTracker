export interface Submission {
  id?: number;
  status: string;
  submittedAt?: string;
  archivedByManager?: boolean;
  checklistinfo?: {
    name?: string;
    managerName?: string;
  };
}
