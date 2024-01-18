import { useAxios } from "../../useAxios";
import { useQuery } from "@tanstack/react-query";
import { Repository } from "../../../store/model/repository.model";
import { Issue } from "../../../store/model/issue.model";

export const useGetRepositoryIssues = (repository: Repository | null) => {
  const { axios } = useAxios();
  return useQuery<Issue[]>({
    initialData: [],
    queryKey: ["repository-issues", repository?.id],
    queryFn: () =>
      axios
        .get(`issues/${repository?.id ?? ""}/issues`)
        .then((res) => res.data),
  });
};
