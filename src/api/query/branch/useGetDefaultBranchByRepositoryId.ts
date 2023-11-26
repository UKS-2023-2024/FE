import { Branch } from "../../../store/model/branch.model";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";

export const useGetDefaultBranchByRepositoryId = (repositoryId: string) => {
  const { axios } = useAxios();
  return useQuery<Branch>({
    queryKey: ["default-branch"],
    queryFn: () => axios.get(`/branches/default/${repositoryId}`).then((res) => res.data),
  });
};
