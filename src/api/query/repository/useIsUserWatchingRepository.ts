import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";

export const useIsUserWatchingRepository = (repositoryId: string) => {
  const { axios } = useAxios();
  return useQuery<number | null>({
    initialData: null,
    queryKey: ["is-user-watching", repositoryId],
    queryFn: () => axios.get(`/repositories/is-user-watching/${repositoryId}`).then((res) => res.data),
  });
};
