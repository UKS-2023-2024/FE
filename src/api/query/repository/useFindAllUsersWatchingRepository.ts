import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { UserWatching } from "../../../store/model/user.model";

export const useFindAllUsersWatchingRepository = (repositoryId: string) => {
  const { axios } = useAxios();
  return useQuery<UserWatching[]>({
    initialData: [],
    queryKey: ["users-watching", repositoryId],
    queryFn: () => axios.get(`/repositories/users-watching/${repositoryId}`).then((res) => res.data),
  });
};
