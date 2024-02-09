import { useToast } from "../../../components/toast";
import { useAxios } from "../../useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useForkRepository = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repositoryId: string) =>
      axios.post(`/repositories/forks/${repositoryId}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Repository forked!",
      });
      queryClient.invalidateQueries({ queryKey: ["number-of-forks"] });
    },
    onError: (e: any) => {
      toast({
        title: e.response.data.Message,
        variant: "error",
      });
    },
  });
};
