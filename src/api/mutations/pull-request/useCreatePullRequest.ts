import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../../store/store";
import { CreatePullRequestParams } from "../../../models/pull-requests/CreatePullRequestParams";

export const useCreatePullRequest = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedRepository] = useAtom(currentRepositoryAtom);

  return useMutation({
    mutationFn: (params: CreatePullRequestParams) =>
      axios.post(`/pull-requests`, params).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Pull request successfully created!",
      });
      navigate(`/repository/${selectedRepository.name}/pull-requests`);
    },
    onError: (e: any) => {
      toast({
        title: e.response.data.Message,
        variant: "error",
      });
    },
  });
};
