import { Organization } from "./organization.model";
import { RepositoryMember } from "./repositoryMember.model";

export type Repository = {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  organization: Organization;
  members: RepositoryMember[]
};
