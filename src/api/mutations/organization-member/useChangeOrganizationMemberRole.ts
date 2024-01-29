import { useToast } from "../../../components/toast";
import { ChangeOrganizationMemberRoleParams } from "../../../models/organization/ChangeOrganizationMemberRoleParams";
import { useAxios } from "../../useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useChangeOrganizationMemberRole = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangeOrganizationMemberRoleParams) =>
      axios.patch(`/organizations/change-user-role/${data.organizationId}/${data.organizationMemberId}/${data.organizationRole}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Member role changed!",
      });
      queryClient.invalidateQueries({ queryKey: ["organization-member-role"] });
    },
    onError: (e: any) => {
      toast({
        title: e.response.data.Message,
        variant: "error",
      });
    },
  });
};
