import { useToast } from "../../../components/toast";
import { useAxios } from "../../useAxios";
import { useMutation } from "@tanstack/react-query";

export const useMakeBranchDefault = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => 
      axios.patch(`/branches/make-default/${id}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Successfully switched default branch!",
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
