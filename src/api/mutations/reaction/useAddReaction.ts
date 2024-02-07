import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";
import { CreateReactionParams } from "../../../models/reaction/CreateReactionParams";

export const useAddReaction = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: CreateReactionParams) =>
      axios.post(`/reactions`, params).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Reaction successfully added!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with adding reaction!",
        variant: "error",
      });
    },
  });
};
