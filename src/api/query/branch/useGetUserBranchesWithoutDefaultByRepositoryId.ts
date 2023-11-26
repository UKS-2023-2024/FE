import { Branch } from "../../../store/model/branch.model";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { PagedResult } from "../../../store/model/pagedResult.model";

export const useGetUserBranchesWithoutDefaultByRepositoryId = (repositoryId: string, pageNumber: number) => {
  const { axios } = useAxios();
  return useQuery<PagedResult<Branch>>({
    initialData: {data: [], totalItems: 0},
    queryKey: ["user-branches-without-default"],
    queryFn: () => axios.get(`/branches/user/without-default/${repositoryId}/10/${pageNumber}`).then((res) => res.data),
  });
};
