import { useToast } from "../../../components/toast";
import { WatchRepositoryParams } from "../../../modules/repository/model/WatchRepositoryParams";
import { useAxios } from "../../useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useWatchRepository = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WatchRepositoryParams) =>
      axios.patch(`/repositories/watch`, data).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "You changed your watching preferences!",
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
