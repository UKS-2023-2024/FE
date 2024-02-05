import { useToast } from "../../components/toast";
import { RegisterUserParams } from "../../models/auth/RegisterUserParams";
import { useAxios } from "../useAxios";
import { useMutation } from "@tanstack/react-query";

export const useRegisterUser = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: RegisterUserParams) =>
      axios.post("/auth/register", data).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Successfully registered!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with registration!",
        variant: "error",
      });
    },
  });
};
