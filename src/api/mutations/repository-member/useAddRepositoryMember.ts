import { useToast } from "../../../components/toast";
import { AddRepositoryMemberParams } from "../../../models/repositories/AddRepositoryMemberParams";
import { useAxios } from "../../useAxios";
import { useMutation } from "@tanstack/react-query";

export const useAddRepositoryMember = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: AddRepositoryMemberParams) =>
      axios.post(`/repositories/send-invite/${data.repositoryId}/${data.userId}`).then((res) => res.data),
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
