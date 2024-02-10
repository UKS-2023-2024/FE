import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";

export const useDeleteReaction = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) =>
      axios.delete(`/reactions/${id}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Reaction successfully removed!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with removing reaction!",
        variant: "error",
      });
    },
  });
};
