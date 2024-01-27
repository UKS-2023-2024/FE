export type OrganizationMemberPresenter = {
  memberId: string;
  username: string;
  role: OrganizationMemberRole;
  primaryEmail: string;
};

export enum OrganizationMemberRole {
  OWNER,
  MEMBER
}