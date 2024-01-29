export type CreateIssueParams = {
  title: string;
  description?: string;
  repositoryId: string;
  assigneeIds?: string[];
  labelIds?: string[];
  milestoneId?: string;
};
