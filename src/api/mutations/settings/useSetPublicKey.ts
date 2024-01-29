import { useMutation } from "@tanstack/react-query"
import { useAxios } from "../../useAxios"
import { useToast } from "../../../components/toast"

export const useSetPublicKey = () => {
    const { axios } = useAxios();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (pk: string) => axios.patch('/auth/user/pk', { pk }),
        onSuccess: () => {
            toast({
                title: "Successfully saved ssh key!"
            })
        },
        onError: (e: any) => {
            toast({
                title: "Something went wrong!",
                description: e.response?.data?.message,
                variant: "error",
            })
        }
    })
}