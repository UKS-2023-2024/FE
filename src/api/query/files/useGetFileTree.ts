import { useQuery } from "@tanstack/react-query"
import { useAxios } from "../../useAxios"

export const useGetFileTree = (
    branchId: string | undefined,
    path: string
) => {
    const { axios } = useAxios();


    return useQuery({
        queryKey: ["file-tree", branchId, path],
        queryFn: () => axios.get(`/branches/${branchId}/tree/${encodeURIComponent(path)}`)
            .then(res => res.data),
        initialData: []
    })
}