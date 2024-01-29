import { RepositoryMemberRole } from "../../store/model/repositoryMember.model";

export type ChangeRepositoryMemberRoleParams = {
  repositoryMemberId: string;
  repositoryId: string;
  repositoryRole: RepositoryMemberRole
};
