import { useAxios } from "../../useAxios";
import { useQuery } from "@tanstack/react-query";

export const useGetMilestoneCompletionPercentage = (id: string | null) => {
  const { axios } = useAxios();
  return useQuery<number>({
    initialData: -1,
    queryKey: ["milestone-completion-percentage", id],
    queryFn: () =>
      axios.get(`/milestones/completion-percentage/${id ?? ""}`).then((res) => res.data),
  });
};
