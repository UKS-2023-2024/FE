import { RepositoryMember } from "./repositoryMember.model";
import { User } from "./user.model";

export type Event = {
  id: string;
  createdAt: Date;
  creator: User;
  eventType: number;
  title: string;
  taskId: string;
  assignee: RepositoryMember;
};
