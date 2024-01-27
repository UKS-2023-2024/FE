
import { useAtom } from "jotai";
import { useToast } from "../../../components/toast";
import { tokenAtom } from "../../../store/store";
import { useGetCurrentUser } from "../../query/useGetCurrentUser";
import { useAxios } from "../../useAxios";
import { useMutation } from "@tanstack/react-query";
import { UpdateNotificationPreferencesParams } from "../../../modules/user/model/UpdateNotificationPreferencesParams";


export const useUpdateNotificationPreferences= () => {
  const { mutateAsync: getCurrentUser } = useGetCurrentUser();
  const [token, setToken] = useAtom(tokenAtom);
  const { axios } = useAxios();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data : UpdateNotificationPreferencesParams) =>
      axios.patch("/notifications/preferences", data).then((res) => res.data),
    onSuccess: () => {
      getCurrentUser(token?? "")
      toast({
        title: "Successfully updated notification preferences!",
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
