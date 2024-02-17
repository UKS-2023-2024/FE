import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios"

export const useGetPrDiff = () => {
    const { axios } = useAxios();
    return useQuery({
        queryKey: ['pr-diff'],
        queryFn: () => axios.get('pull-requests/test').then(res => res.data),
        initialData: ""
    })
}