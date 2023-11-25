import { useAxios } from "../../useAxios";
import { useQuery } from "@tanstack/react-query";
import { Milestone } from "../../../store/model/milestone.model";
import { Repository } from "../../../store/model/repository.model";

export const useGetRepositoryMilestones = (repository: Repository | null) => {
  const { axios } = useAxios();
  return useQuery<Milestone[]>({
    initialData: [],
    queryKey: ["repository-milestones", repository?.id],
    queryFn: () =>
      axios.get(`/milestones/${repository?.id ?? ""}`).then((res) => res.data),
  });
};
