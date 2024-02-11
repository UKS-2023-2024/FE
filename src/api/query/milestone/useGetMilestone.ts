import { useAxios } from "../../useAxios";
import { useQuery } from "@tanstack/react-query";
import { Milestone } from "../../../store/model/milestone.model";

export const useGetMilestone = (milestoneId: string) => {
  const { axios } = useAxios();
  return useQuery<Milestone>({
    initialData: {},
    queryKey: ["milestone", milestoneId],
    queryFn: () =>
      axios
        .get(`/milestones/milestone/${milestoneId ?? ""}`)
        .then((res) => res.data),
  });
};
