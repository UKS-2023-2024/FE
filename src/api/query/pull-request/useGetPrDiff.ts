import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios"

export const useGetPrDiff = (
    id?: string
) => {
    const { axios } = useAxios();
    return useQuery({
        queryKey: ['pr-diff', id],
        queryFn: () => axios.get(`pull-requests/${id}/diff`).then(res => res.data),
        initialData: ""
    })
}