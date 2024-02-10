import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";
import { MergePullRequestParams } from "../../../models/pull-requests/MergePullRequestParams";

export const useMergePullRequest = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: MergePullRequestParams) =>
      axios.patch(`/pull-requests/merge/${params.repositoryId}/${params.pullRequestId}/${params.mergeType}`, params)
        .then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Pull request successfully merged!",
      });
    },
    onError: (e: any) => {
      toast({
        title: e.response.data.Message,
        variant: "error",
      });
    },
  });
};
