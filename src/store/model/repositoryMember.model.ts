import { User } from "./user.model";

export type RepositoryMember = {
  id: string;
  member: User;
  role: number;
};

export type RepositoryMemberPresenter = {
  id: string;
  memberId: string;
  username: string;
  role: RepositoryMemberRole;
};

export enum RepositoryMemberRole {
  OWNER,
  ADMIN,
  READ,
  WRITE
}