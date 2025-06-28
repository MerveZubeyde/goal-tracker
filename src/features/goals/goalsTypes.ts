export interface Goal {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  progress: number;
  userId: string;
  subtasks?: string[];
  completedSubtasks?: string[];
}
