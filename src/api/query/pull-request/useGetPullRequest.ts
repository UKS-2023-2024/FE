import { useAxios } from "../../useAxios";
import { useQuery } from "@tanstack/react-query";
import { PullRequest } from "../../../store/model/pullRequest.model";

export const useGetPullRequest = (id: string) => {
  const { axios } = useAxios();
  return useQuery<PullRequest>({
    queryKey: ["repository-pull-request", id],
    queryFn: () => axios.get(`pull-requests/${id}`).then((res) => {
      console.log(res.data)
      return res.data
    }),
  });
};
