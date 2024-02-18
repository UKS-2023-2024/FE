import { Issue } from "./issue.model";
import { Reaction } from "./reaction.model";
import { User } from "./user.model";

export type Comment = {
  id: string;
  creator: User;
  creatorId: string;
  content: string;
  taskId: string;
  task: Issue;
  createdAt: Date;
  reactions: Reaction[];
  parentId: string;
};

export type CommentHierarchy = {
  parent: CommentHierarchy;
  comment: Comment;
};

