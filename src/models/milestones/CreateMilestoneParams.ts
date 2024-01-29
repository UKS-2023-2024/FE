export type CreateMilestoneParams = {
  id?: string;
  repositoryId: string;
  title: string;
  description: string;
  dueDate?: string;
};
