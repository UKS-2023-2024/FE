import { useToast } from "../../../components/toast";
import { useAxios } from "../../useAxios";
import { useMutation } from "@tanstack/react-query";

export const useAcceptRepositoryInvite = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (token: string) =>
      axios.post(`/repositories/add-user/${token}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "You were added to repository!",
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
