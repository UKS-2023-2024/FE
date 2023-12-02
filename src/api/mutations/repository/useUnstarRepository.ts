import { useToast } from "../../../components/toast";
import { useAxios } from "../../useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUnstarRepository = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axios.patch(`/repositories/unstar/${id}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Repository unstarred!",
      });
      queryClient.invalidateQueries({ queryKey: ["user-starred"] });
      queryClient.invalidateQueries({ queryKey: ["users-that-starred"] });
    },
    onError: (e: any) => {
      toast({
        title: e.response.data.Message,
        variant: "error",
      });
    },
  });
};
