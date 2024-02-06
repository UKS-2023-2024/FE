import { Comment } from "./comment.model";
import { Event } from "./event.model";

export type Issue = {
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
  comments: Comment[];
};
