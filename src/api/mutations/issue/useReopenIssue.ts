import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";

export const useReopenIssue = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (issueId: string) =>
      axios.post(`/issues/reopen/${issueId}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Issue successfully reopened!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with reopening issue!",
        variant: "error",
      });
    },
  });
};
