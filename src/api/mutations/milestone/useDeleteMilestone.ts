import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";

export const useDeleteMilestone = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) =>
      axios.delete(`/milestones/${id}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Milestone successfully deleted!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with milestone deletion!",
        variant: "error",
      });
    },
  });
};
