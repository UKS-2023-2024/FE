import { useAxios } from "../../useAxios";
import { useQuery } from "@tanstack/react-query";
import { EventPresenter } from "../../../store/model/pullRequest.model";

export const useGetPullRequestEvents = (id: string) => {
  const { axios } = useAxios();
  return useQuery<EventPresenter[]>({
    queryKey: ["pull-request-events", id],
    queryFn: () =>
      axios.get(`pull-requests/${id}/events`).then((res) => res.data),
  });
};
