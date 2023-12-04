export interface Checklist {
  info: {
    id: number;
    name: string;
    dueDate: string;
    viewed: boolean;
  };
  manager: {
    id: number;
    name: string;
  };
}
