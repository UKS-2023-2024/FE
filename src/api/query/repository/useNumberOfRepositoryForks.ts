import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";

export const useNumberOfRepositoryForks = (repositoryId: string) => {
  const { axios } = useAxios();
  return useQuery<number>({
    initialData: 0,
    queryKey: ["number-of-forks", repositoryId],
    queryFn: () => axios.get(`/repositories/forks/${repositoryId}`).then((res) => res.data),
  });
};
