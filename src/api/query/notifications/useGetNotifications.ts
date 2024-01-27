import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { Notification } from "../../../store/model/notification.model";
import { PagedResult } from "../../../store/model/pagedResult.model";

export const useGetNotifications = (pageNumber: number) => {
  const { axios } = useAxios();
  return useQuery<PagedResult<Notification>>({
    initialData: {data: [], totalItems: 0},
    queryKey: ["notifications"],
    queryFn: () => axios.get(`/notifications/5/${pageNumber}`).then((res) => res.data),
  });
};
