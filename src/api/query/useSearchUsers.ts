import { User } from "../../store/model/user.model";
import { useAxios } from "../useAxios";
import { useQuery } from "@tanstack/react-query";

export const useSearchUsers = (value: string) => {
  const { axios } = useAxios();
  return useQuery<User[]>({
    initialData: [],
    queryKey: ["search-users", value],
    queryFn: () =>
      axios.get(`/users/search`, { params: { value } }).then((res) => res.data),
  });
};
