export interface Report {
  $id?: string;
  weekNumber: string;
  tasks: string;
  learnings: string;
  challenges: string;
  nextWeekPlan: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReportFormData {
  weekNumber: string;
  tasks: string;
  learnings: string;
  challenges: string;
  nextWeekPlan: string;
}