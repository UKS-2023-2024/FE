import { Issue } from "./issue.model";
import { User } from "./user.model";

export type Comment = {
  creator: User;
  creatorId: string;
  content: string;
  taskId: string;
  Task: Issue;
  createdAt: Date;
};
