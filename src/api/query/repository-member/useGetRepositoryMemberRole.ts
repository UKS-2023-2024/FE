import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { RepositoryMemberRole } from "../../../store/model/repositoryMember.model";

export const useGetRepositoryMemberRole = (repositoryId: string) => {
  const { axios } = useAxios();
  return useQuery<RepositoryMemberRole>({
    initialData: undefined,
    queryKey: ["repository-member-role", repositoryId],
    queryFn: () => axios.get(`/repositories/${repositoryId}/member-role`).then((res) => res.data),
  });
};
