import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";
import { CreateCommentParams } from "../../../models/comment/CreateCommentParams";

export const useAddIssueComment = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: CreateCommentParams) =>
      axios.post(`/comments`, params).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Comment successfully added!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with adding comment!",
        variant: "error",
      });
    },
  });
};
