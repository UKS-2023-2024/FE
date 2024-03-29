import { useAxios } from "../../useAxios";
import { useQuery } from "@tanstack/react-query";
import { Repository } from "../../../store/model/repository.model";
import { Label } from "../../../store/model/label.model";

export const useGetRepositoryLabels = (
  repository: Repository | null,
  search: string
) => {
  const { axios } = useAxios();
  return useQuery<Label[]>({
    initialData: [],
    queryKey: ["repository-labels", repository?.id, search],
    queryFn: () =>
      axios
        .get(`labels/${repository?.id ?? ""}/defaults?search=${search}`)
        .then((res) => res.data),
  });
};
