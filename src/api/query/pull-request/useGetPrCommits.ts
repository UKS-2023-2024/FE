import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios"

export const useGetPrCommits = (
    id?: string
) => {
    const { axios } = useAxios();
    return useQuery({
        queryKey: ['pr-commits', id],
        queryFn: () => axios.get(`pull-requests/${id}/commits`).then(res => res.data),
        initialData: []
    })
}