import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";
import { useQueryClient } from "@tanstack/react-query";

export const useDeleteMilestone = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axios.delete(`/milestones/${id}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Milestone successfully deleted!",
      });
      queryClient.invalidateQueries({ queryKey: ["repository-milestones"] });
    },
    onError: () => {
      toast({
        title: "Something wrong with milestone deletion!",
        variant: "error",
      });
    },
  });
};
