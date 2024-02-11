import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { UpdatePullRequestParams } from "../../../models/pull-requests/UpdatePullRequestParams";
import { useToast } from "../../../components/toast";

export const useAssignUsersToPullRequest = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: UpdatePullRequestParams) =>
      axios.put(`/pull-requests/assignees/update`, params).then((res) => res.data),
    onError: (e: any) => {
      toast({
        title: e.response.data.Message,
        variant: "error",
      });
    },
  });
};
