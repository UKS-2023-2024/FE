export type CreatePullRequestParams = {
  title: string;
  description?: string;
  repositoryId: string;
  assigneeIds?: string[];
  labelIds?: string[];
  issueIds?: string[];
  milestoneId?: string;
  fromBranchId: string;
  toBranchId: string;
};
