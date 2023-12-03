import { useAxios } from "../../useAxios";
import { useQuery } from "@tanstack/react-query";
import { Milestone } from "../../../store/model/milestone.model";
import { Repository } from "../../../store/model/repository.model";

export const useGetRepositoryClosedMilestones = (
  repository: Repository | null
) => {
  const { axios } = useAxios();
  return useQuery<Milestone[]>({
    initialData: [],
    queryKey: ["repository-closed-milestones", repository?.id],
    queryFn: () =>
      axios
        .get(`/milestones/${repository?.id ?? ""}/closed`)
        .then((res) => res.data),
  });
};
