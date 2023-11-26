import { Branch } from "../../../store/model/branch.model";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";

export const useGetAllBranchesWithoutDefaultByRepositoryId = (repositoryId: string) => {
  const { axios } = useAxios();
  return useQuery<Branch[]>({
    initialData: [],
    queryKey: ["all-branches-without-default"],
    queryFn: () => axios.get(`/branches/without-default/${repositoryId}`).then((res) => res.data),
  });
};
