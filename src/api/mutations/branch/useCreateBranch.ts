import { useToast } from "../../../components/toast";
import { CreateBranchParams } from "../../../modules/repository/branches/model/CreateBranchParams";
import { useAxios } from "../../useAxios";
import { useMutation } from "@tanstack/react-query";

export const useCreateBranch = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateBranchParams) =>
      axios.post("/branches", data).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Branch successfully created!",
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
