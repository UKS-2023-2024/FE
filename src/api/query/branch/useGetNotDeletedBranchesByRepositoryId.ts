import { Branch } from "../../../store/model/branch.model";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";

export const useGetNotDeletedBranchesByRepositoryId = (repositoryId: string) => {
  const { axios } = useAxios();
  return useQuery<Branch[]>({
    initialData: [],
    queryKey: ["not-deleted-branches"],
    queryFn: () => axios.get(`/branches/not-deleted/${repositoryId}`).then((res) => res.data),
  });
};
