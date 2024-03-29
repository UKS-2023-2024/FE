import { Repository } from "../../../store/model/repository.model";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";

export const useGetRepositoriesForLoggedUser = () => {
  const { axios } = useAxios();
  return useQuery<Repository[]>({
    initialData: [],
    queryKey: ["user-repositories"],
    queryFn: () => axios.get(`/repositories/owner`).then((res) => res.data),
  });
};
