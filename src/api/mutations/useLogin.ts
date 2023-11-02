/* eslint-disable react-hooks/exhaustive-deps */
import { useAtom } from "jotai";
import { LoginFormValues } from "../../components/auth/LoginForm";
import { useToast } from "../../components/toast";
import { tokenAtom } from "../../store/store";
import { useAxios } from "../useAxios";
import { useMutation } from "@tanstack/react-query";
import { useGetCurrentUser } from "../query/useGetCurrentUser";

export const useLogin = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const [, setToken] = useAtom(tokenAtom)
  const { mutateAsync: getCurrentUser } = useGetCurrentUser();
  return useMutation({
    mutationFn: (data: LoginFormValues) =>
      axios.post("/auth/login", data).then((res) => res.data),
    onSuccess: (token: string) => {
      setToken(token)
      getCurrentUser(token)
      toast({
        title: "You have been logged in!",
      });
    },
    onError: () => {
      toast({
        title: "Wrong credencials!",
        variant: "error",
      });
    },
  });
};
