import { useToast } from "../../../components/toast";
import { CreateUserRepositoryParams } from "../../../modules/repository/model/CreateUserRepositoryParams";
import { useAxios } from "../../useAxios";
import { useMutation } from "@tanstack/react-query";

export const useCreateUserRepository = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateUserRepositoryParams) =>
      axios.post("/repositories/user", data).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Repository successfully created!",
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
