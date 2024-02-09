import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";

export const useReopenPullRequest = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (prId: string) =>
      axios.put(`/pull-requests/reopen/${prId}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Pull request successfully reopened!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with reopening pull request!",
        variant: "error",
      });
    },
  });
};
