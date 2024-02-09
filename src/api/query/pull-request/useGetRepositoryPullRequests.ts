import { useAxios } from "../../useAxios";
import { useQuery } from "@tanstack/react-query";
import { PullRequest } from "../../../store/model/pullRequest.model";

export const useGetRepositoryPullRequests = (repositoryId: string) => {
  const { axios } = useAxios();
  return useQuery<PullRequest[]>({
    initialData: [],
    queryKey: ["repository-pull-requests", repositoryId],
    queryFn: () =>
      axios
        .get(`pull-requests/${repositoryId}/pull-requests`)
        .then((res) => res.data),
  });
};
