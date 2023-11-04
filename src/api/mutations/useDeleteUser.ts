import { useAtom } from "jotai";
import { useToast } from "../../components/toast";
import { UpdateUserParams } from "../../modules/user/model/UpdateUserParams";
import { useGetCurrentUser } from "../query/useGetCurrentUser";
import { useAxios } from "../useAxios";
import { useMutation } from "@tanstack/react-query";
import { tokenAtom } from "../../store/store";

export const useDeleteUser = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const [token, setToken] = useAtom(tokenAtom)
  const { mutateAsync: getCurrentUser } = useGetCurrentUser();

  return useMutation({
    mutationFn: () =>
      axios.delete("/user").then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Successfully deleted profile!",
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
