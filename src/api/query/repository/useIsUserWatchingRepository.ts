import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";

export const useIsUserWatchingRepository = (repositoryId: string) => {
  console.log("e")
  const { axios } = useAxios();
  return useQuery<boolean>({
    initialData: false,
    queryKey: ["is-user-watching", repositoryId],
    queryFn: () => axios.get(`/repositories/is-user-watching/${repositoryId}`).then((res) => res.data),
  });
};
