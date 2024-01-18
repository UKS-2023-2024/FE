import { Branch } from "../../../store/model/branch.model";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { PagedResult } from "../../../store/model/pagedResult.model";

export const useGetAllBranchesWithoutDefaultByRepositoryIdPagination = (repositoryId: string, pageNumber: number) => {
  const { axios } = useAxios();
  return useQuery<PagedResult<Branch>>({
    initialData: {data: [], totalItems: 0},
    queryKey: ["all-branches-without-default-pagination", repositoryId],
    queryFn: () => axios.get(`/branches/without-default/${repositoryId}/10/${pageNumber}`).then((res) => res.data),
  });
};
