import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";

export const useDeleteLabel = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (labelId: string) =>
      axios.delete(`/labels/${labelId}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Label successfully deleted!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with label deletion!",
        variant: "error",
      });
    },
  });
};
