import { useToast } from "../../../components/toast";
import { AddOrganizationMemberParams } from "../../../modules/organization/model/AddOrganizationMemberParams";
import { useAxios } from "../../useAxios";
import { useMutation } from "@tanstack/react-query";

export const useAddOrganizationMember = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: AddOrganizationMemberParams) =>
      axios.post(`/organizations/${data.organizationId}/members/${data.userId}/invite`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Invite sent!",
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
