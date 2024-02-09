import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";

export const useClosePullRequest = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (prId: string) =>
      axios.put(`/pull-requests/close/${prId}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Pull request successfully closed!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with closing pull request!",
        variant: "error",
      });
    },
  });
};
