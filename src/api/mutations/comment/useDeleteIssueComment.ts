import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";

export const useDeleteIssueComment = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (commentId: string) =>
      axios.delete(`/comments/${commentId}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Comment successfully deleted!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with deleting comment!",
        variant: "error",
      });
    },
  });
};
