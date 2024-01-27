import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../../store/store";
import { UpdateIssueParams } from "../../../modules/issue/model/UpdateIssueParams";

export const useAssignIssueToUser = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedRepository] = useAtom(currentRepositoryAtom);

  return useMutation({
    mutationFn: (params: UpdateIssueParams) =>
      axios.post(`/issues/assignee/update`, params).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Issue successfully assigned!",
      });
      // navigate(`/repository/${selectedRepository.name}/issues`);
    },
    onError: () => {
      toast({
        title: "Something wrong with issue assign!",
        variant: "error",
      });
    },
  });
};
