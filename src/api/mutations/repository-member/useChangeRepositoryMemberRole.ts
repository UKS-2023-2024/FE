import { useToast } from "../../../components/toast";
import { ChangeRepositoryMemberRoleParams } from "../../../modules/repository/model/ChangeRepositoryMemberRoleParams";
import { useAxios } from "../../useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useChangeRepositoryMemberRole = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangeRepositoryMemberRoleParams) =>
      axios.patch(`/repositories/change-user-role/${data.repositoryId}/${data.repositoryMemberId}/${data.repositoryRole}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Member role changed!",
      });
      queryClient.invalidateQueries({ queryKey: ["repository-member-role"] });
    },
    onError: (e: any) => {
      toast({
        title: e.response.data.Message,
        variant: "error",
      });
    },
  });
};
