import { useToast } from "../../../components/toast";
import { RemoveRepositoryMemberParams } from "../../../modules/repository/model/RemoveRepositoryMemberParams";
import { useAxios } from "../../useAxios";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export const useRemoveRepositoryMember = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RemoveRepositoryMemberParams) =>
      axios.delete(`/repositories/remove-user/${data.repositoryId}/${data.repositoryMemberId}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Member removed!",
      });
      queryClient.invalidateQueries({ queryKey: ["repository-members"] });
    },
    onError: (e: any) => {
      toast({
        title: e.response.data.Message,
        variant: "error",
      });
    },
  });
};