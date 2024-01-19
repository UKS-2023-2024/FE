import { useToast } from "../../../components/toast";
import { RemoveOrganizationMemberParams } from "../../../modules/organization/model/RemoveOrganizationMemberParams";
import { useAxios } from "../../useAxios";
import { useMutation } from "@tanstack/react-query";

export const useRemoveOrganizationMember = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: RemoveOrganizationMemberParams) =>
      axios.delete(`/organizations/${data.organizationId}/members/${data.organizationMemberId}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Member removed!",
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
