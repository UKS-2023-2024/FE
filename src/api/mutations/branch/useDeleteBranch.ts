import { useToast } from "../../../components/toast";
import { useAxios } from "../../useAxios";
import { useMutation } from "@tanstack/react-query";

export const useDeleteBranch = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => 
      axios.delete(`/branches/${id}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Branch successfully deleted!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with branch deletion!",
        variant: "error",
      });
    },
  });
};
