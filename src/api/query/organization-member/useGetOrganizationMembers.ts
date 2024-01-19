import { useQuery } from "@tanstack/react-query";
import { OrganizationMemberPresenter, OrganizationMemberRole } from "../../../store/model/organizationMember.model";
import { useAxios } from "../../useAxios";

export const useGetOrganizationMembers = (organizationId: string) => {
  const { axios } = useAxios();
  const roleStringToEnum: Record<string, OrganizationMemberRole> = {
    'OWNER': OrganizationMemberRole.OWNER,
    'MEMBER': OrganizationMemberRole.MEMBER,
  };
  return useQuery<OrganizationMemberPresenter[]>({
    initialData: [],
    queryKey: ["organization-members", organizationId],
    queryFn: () => axios.get(`/organizations/${organizationId}/members`).then((res) => {
      const members: OrganizationMemberPresenter[] = res.data.map((member: any) => ({
        memberId: member.memberId,
        username: member.username,
        role: roleStringToEnum[member.role],
        primaryEmail: member.primaryEmail,
      }));
      return members;
    }
    ),
  });
};


