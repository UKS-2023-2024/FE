import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";
import { UpdatePullRequestParams } from "../../../models/pull-requests/UpdatePullRequestParams";

export const useAssignUsersToPullRequest = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: UpdatePullRequestParams) =>
      axios.put(`/pull-requests/assignees/update`, params).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "User successfully assigned!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with user assign!",
        variant: "error",
      });
    },
  });
};
