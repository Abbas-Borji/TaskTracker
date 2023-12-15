export interface ManagerSubmission {
  id?: number;
  status: string;
  submittedAt?: string;
  archivedByManager?: boolean;
  checklistinfo?: {
    name?: string;
  };
}
