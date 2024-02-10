import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";
import { UpdatePullRequestParams } from "../../../models/pull-requests/UpdatePullRequestParams";

export const useAssignIssuesToPullRequest = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: UpdatePullRequestParams) =>
      axios.put(`/pull-requests/issues/update`, params).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Issue successfully assigned!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with issue assign!",
        variant: "error",
      });
    },
  });
};
