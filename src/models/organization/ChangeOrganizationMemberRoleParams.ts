import { OrganizationMemberRole } from "../../store/model/organizationMember.model";

export type ChangeOrganizationMemberRoleParams = {
  organizationMemberId: string;
  organizationId: string;
  organizationRole: OrganizationMemberRole
};