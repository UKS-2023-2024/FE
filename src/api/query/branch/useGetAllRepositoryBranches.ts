import { Branch } from "../../../store/model/branch.model";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";

export const useGetAllRepositoryBranches = (repositoryId: string) => {
  const { axios } = useAxios();
  return useQuery<Branch[]>({
    queryKey: ["all-repository-branches", repositoryId],
    queryFn: () => axios.get(`/branches/all/${repositoryId}`).then((res) => res.data),
  });
};
