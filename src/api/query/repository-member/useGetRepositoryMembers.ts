import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { RepositoryMemberPresenter } from "../../../store/model/repositoryMember.model";

export const useGetRepositoryMembers = (repositoryId: string) => {
  const { axios } = useAxios();
  return useQuery<RepositoryMemberPresenter[]>({
    initialData: [],
    queryKey: ["repository-members", repositoryId],
    queryFn: () => axios.get(`/repositories/${repositoryId}/members`).then((res) => res.data),
  });
};
