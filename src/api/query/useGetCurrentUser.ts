import { useAtom } from "jotai";
import { useToast } from "../../components/toast";
import { currentUserAtom } from "../../store/store";
import { useAxios } from "../useAxios";
import { useMutation } from "@tanstack/react-query";
import { User } from "../../store/model/user.model";

export const useGetCurrentUser = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const [, setCurrentUser] = useAtom(currentUserAtom)
  return useMutation({
    mutationFn: (token: string) =>
      axios.get("/auth/current", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then((res) => res.data),
    onSuccess: (user: User) => {
      setCurrentUser(user)
    },
    onError: () => {
      toast({
        title: "Failed fetching user!",
        variant: "error",
      });
    },
  });
};
