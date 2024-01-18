import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { OrganizationMemberRole } from "../../../store/model/organizationMember.model";

export const useGetOrganizationMemberRole = (organizationId: string) => {
  const { axios } = useAxios();
  return useQuery<OrganizationMemberRole>({
    initialData: undefined,
    queryKey: ["organization-member-role", organizationId],
    queryFn: () => axios.get(`/organizations/${organizationId}/member-role`).then((res) => {
      if (res.data == "OWNER") return OrganizationMemberRole.OWNER;
      return OrganizationMemberRole.MEMBER;
    }),
  });
};
