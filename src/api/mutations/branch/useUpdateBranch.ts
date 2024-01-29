import { useToast } from "../../../components/toast";
import { UpdateBranchParams } from "../../../models/repositories/branches/UpdateBranchParams";
import { useAxios } from "../../useAxios";
import { useMutation } from "@tanstack/react-query";

export const useUpdateBranch = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateBranchParams) =>
      axios.patch(`/branches`, data).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Branch successfully updated!",
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
