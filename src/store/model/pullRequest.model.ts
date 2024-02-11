import { Issue } from "./issue.model";
import { Milestone } from "./milestone.model";
import { RepositoryMemberPresenter } from "./repositoryMember.model";

export type PullRequest = {
  id: string;
  title: string;
  description: string;
  repositoryId: string;
  assignees: RepositoryMemberPresenter[];
  events: EventPresenter[];
  labels: any[];
  number: number;
  state: TaskState;
  fromBranch: string;
  toBranch: string;
  issues: IssuePullRequestPresenter[];
  milestone: Milestone;
};

export type EventPresenter = {
  id: string;
  createdAt: Date;
  creator: string;
  eventType: number;
  title: string;
  taskId: string;
};

export type IssuePullRequestPresenter = {
  id: string;
  title: string;
  description: string;
  repositoryId: string;
  number: number;
  state: TaskState;
};

export function mapIssueToPresenter(issue: Issue): IssuePullRequestPresenter {
  return { id: issue.id, description: issue.description, number: issue.number, title: issue.title, state: issue.state, repositoryId: issue.repositoryId }
}

export enum MergeType {
  MERGE,
  REBASE,
  SQUASH
}

export enum TaskState {
  OPEN,
  CLOSED,
  MERGED,
}
