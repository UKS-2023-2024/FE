import { Event } from "./event.model";
import { Issue } from "./issue.model";

export type PullRequest = {
  id: string;
  title: string;
  description: string;
  repositoryId: string;
  assignees: any[];
  events: Event[];
  labels: any[];
  milestone: any;
  number: number;
  state: number;
  fromBranch: string;
  toBranch: string;
  issues: Issue;
};
