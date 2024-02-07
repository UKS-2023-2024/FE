import { User } from "./user.model";

export type Reaction = {
  id: string;
  creator: User;
  creatorId: string;
  comment: Comment;
  commentId: string;
  emojiCode: string;
};
