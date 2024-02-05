import { useQuery } from "@tanstack/react-query";
import { OrganizationMemberPresenter } from "../../../store/model/organizationMember.model";
import { useAxios } from "../../useAxios";

export const useGetOrganizationMembers = (organizationId: string) => {
  const { axios } = useAxios();
  return useQuery<OrganizationMemberPresenter[]>({
    initialData: [],
    queryKey: ["organization-members", organizationId],
    queryFn: () => axios.get(`/organizations/${organizationId}/members`).then((res) => res.data),
  });
};


