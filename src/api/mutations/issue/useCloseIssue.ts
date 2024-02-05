import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";

export const useCloseIssue = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (issueId: string) =>
      axios.post(`/issues/close/${issueId}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Issue successfully closed!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with closing issue!",
        variant: "error",
      });
    },
  });
};
