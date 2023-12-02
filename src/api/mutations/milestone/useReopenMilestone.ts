import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";
import { useQueryClient } from "@tanstack/react-query";

export const useReopenMilestone = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axios.put(`/milestones/${id}/reopen`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Milestone successfully reopened!",
      });
      queryClient.invalidateQueries({
        queryKey: ["repository-milestones"],
      });
      queryClient.invalidateQueries({
        queryKey: ["repository-closed-milestones"],
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with reopening milestone!",
        variant: "error",
      });
    },
  });
};
