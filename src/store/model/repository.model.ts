import { Organization } from "./organization.model";
import { RepositoryMemberPresenter } from "./repositoryMember.model";

export type Repository = {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  organization?: Organization;
  members: RepositoryMemberPresenter[];
  forkedFrom: string | undefined;
};
