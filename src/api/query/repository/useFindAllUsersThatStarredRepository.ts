import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { UserThatStarred } from "../../../store/model/user.model";

export const useFindAllUsersThatStarredRepository = (repositoryId: string) => {
  const { axios } = useAxios();
  return useQuery<UserThatStarred[]>({
    initialData: [],
    queryKey: ["users-that-starred", repositoryId],
    queryFn: () => axios.get(`/repositories/users-that-starred/${repositoryId}`).then((res) => res.data),
  });
};
