import { useToast } from "../../../components/toast";
import { useAxios } from "../../useAxios";
import { useMutation } from "@tanstack/react-query";

export const useRestoreBranch = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => 
      axios.patch(`/branches/restore/${id}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Branch successfully restored!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with branch restoration!",
        variant: "error",
      });
    },
  });
};
