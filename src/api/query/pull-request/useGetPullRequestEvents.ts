import { useAxios } from "../../useAxios";
import { useQuery } from "@tanstack/react-query";
import { Event } from "../../../store/model/event.model";

export const useGetPullRequestEvents = (id: string) => {
  const { axios } = useAxios();
  return useQuery<Event[]>({
    queryKey: ["pull-request-events", id],
    queryFn: () =>
      axios.get(`pull-requests/${id}/events`).then((res) => res.data),
  });
};
