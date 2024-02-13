export type UpdatePullRequestParams = {
  id: string;
  issueIds?: string[];
  milestoneId?: string;
  assigneeIds?: string[];
  labelIds?: string[];
};
