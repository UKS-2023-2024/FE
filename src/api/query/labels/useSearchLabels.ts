import { useAxios } from "../../useAxios";
import { useQuery } from "@tanstack/react-query";
import { Repository } from "../../../store/model/repository.model";
import { Label } from "../../../store/model/label.model";

export const useSearchLabels = (
  repository: Repository | null,
  searchValue: string
) => {
  const { axios } = useAxios();
  return useQuery<Label[]>({
    initialData: [],
    queryKey: ["repository-labels", repository?.id],
    queryFn: () =>
      axios
        .get(`labels/${repository?.id ?? ""}?search=${searchValue}`)
        .then((res) => res.data),
  });
};
