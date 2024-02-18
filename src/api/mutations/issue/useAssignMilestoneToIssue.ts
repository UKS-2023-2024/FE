import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";
import { UpdateIssueParams } from "../../../models/issues/UpdateIssueParams";

export const useAssignMilestoneToIssue = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: UpdateIssueParams) =>
      axios.post(`/issues/milestone/update`, params).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Issue successfully updated!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with issue assign to milestone!",
        variant: "error",
      });
    },
  });
};
