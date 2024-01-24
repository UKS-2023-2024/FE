import { useToast } from "../../../components/toast";
import { useAxios } from "../../useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useWatchRepository = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axios.patch(`/repositories/watch/${id}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "You are now watching this repository!",
      });
      queryClient.invalidateQueries({ queryKey: ["is-user-watching"] });
      queryClient.invalidateQueries({ queryKey: ["users-watching"] });
    },
    onError: (e: any) => {
      toast({
        title: e.response.data.Message,
        variant: "error",
      });
    },
  });
};
