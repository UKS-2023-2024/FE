import { useAtom } from "jotai";
import { useToast } from "../../components/toast";
import { UpdateUserParams } from "../../models/settings/UpdateUserParams";
import { useGetCurrentUser } from "../query/useGetCurrentUser";
import { useAxios } from "../useAxios";
import { useMutation } from "@tanstack/react-query";
import { tokenAtom } from "../../store/store";

export const useUpdateUser = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const [token, setToken] = useAtom(tokenAtom)
  const { mutateAsync: getCurrentUser } = useGetCurrentUser();

  return useMutation({
    mutationFn: (data: UpdateUserParams) =>
      axios.patch("/user", data).then((res) => res.data),
    onSuccess: () => {
      getCurrentUser(token ?? "")
      toast({
        title: "Successfully updated profile!",
      });
    },
    onError: () => {
      toast({
        title: "Something went wrong!",
        variant: "error",
      });
    },
  });
};
