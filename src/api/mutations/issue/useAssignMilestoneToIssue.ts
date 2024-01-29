import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../../store/store";
import { UpdateIssueParams } from "../../../models/issues/UpdateIssueParams";

export const useAssignMilestoneToIssue = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedRepository] = useAtom(currentRepositoryAtom);

  return useMutation({
    mutationFn: (params: UpdateIssueParams) =>
      axios.post(`/issues/milestone/update`, params).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Issue successfully assigned to milestone!",
      });
      // navigate(`/repository/${selectedRepository.name}/issues`);
    },
    onError: () => {
      toast({
        title: "Something wrong with issue assign to milestone!",
        variant: "error",
      });
    },
  });
};
