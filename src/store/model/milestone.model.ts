export type Milestone = {
  id: string;
  title: string;
  dueDate: Date;
  description: string;
  repositoryId: string;
  closed: boolean;
  completionPercentage: number
};
