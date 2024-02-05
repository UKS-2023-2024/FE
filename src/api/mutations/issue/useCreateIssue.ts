import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../../store/store";
import { CreateIssueParams } from "../../../models/issues/CreateIssueParams";

export const useCreateIssue = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedRepository] = useAtom(currentRepositoryAtom);

  return useMutation({
    mutationFn: (params: CreateIssueParams) =>
      axios.post(`/issues`, params).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Issue successfully created!",
      });
      navigate(`/repository/${selectedRepository.name}/issues`);
    },
    onError: () => {
      toast({
        title: "Something wrong with issue creation!",
        variant: "error",
      });
    },
  });
};
