import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";

export const useDidUserStarRepository = (repositoryId: string) => {
  const { axios } = useAxios();
  return useQuery<boolean>({
    initialData: false,
    queryKey: ["user-starred", repositoryId],
    queryFn: () => axios.get(`/repositories/did-user-star/${repositoryId}`).then((res) => res.data),
  });
};
