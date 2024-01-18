import { Repository } from "../../../store/model/repository.model";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";

export const useGetRepositoriesUserBelongsTo = () => {
  const { axios } = useAxios();
  return useQuery<Repository[]>({
    initialData: [],
    queryKey: ["user-repositories-user-belongs-to"],
    queryFn: () => axios.get(`/repositories`).then((res) => res.data),
  });
};
