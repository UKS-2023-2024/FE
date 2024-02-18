import { CommentHierarchy } from "../../../store/model/comment.model";
import { useAxios } from "../../useAxios";
import { useQuery } from "@tanstack/react-query";

export const useGetTaskComments = (taskId: string) => {
  const { axios } = useAxios();
  return useQuery<CommentHierarchy[]>({
    initialData: [],
    queryKey: ["task-comments", taskId],
    queryFn: () =>
      axios.get(`comments/${taskId}`).then((res) => res.data),
  });
};
