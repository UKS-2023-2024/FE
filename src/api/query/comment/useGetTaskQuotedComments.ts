import { useAxios } from "../../useAxios";
import { useQuery } from "@tanstack/react-query";
import { Issue } from "../../../store/model/issue.model";

export const useGetTaskQuotedComments = (task: Issue) => {
  const { axios } = useAxios();
  return useQuery<any[]>({
    initialData: [],
    queryKey: ["task-quoted-comments", task?.id],
    queryFn: () =>
      axios.get(`comments/${task?.id ?? ""}`).then((res) => res.data),
  });
};
