import { useAxios } from "../../useAxios";
import { useQuery } from "@tanstack/react-query";
import { Repository } from "../../../store/model/repository.model";
import { Issue } from "../../../store/model/issue.model";
import { Label } from "../../../store/model/label.model";

export const useGetRepositoryLabels = (repository: Repository | null) => {
  const { axios } = useAxios();
  return useQuery<Label[]>({
    initialData: [],
    queryKey: ["repository-labels", repository?.id],
    queryFn: () =>
      axios
        .get(`labels/${repository?.id ?? ""}/defaults`)
        .then((res) => res.data),
  });
};
