export type UpdateIssueParams = {
  id: string;
  title: string;
  description: string;
  repositoryId: string;
  assigneesIds: string[];
  labelsIds: string[];
  milestoneId?: string;
  state: number;
  number: number;
};
