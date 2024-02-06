import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios"

export const useGetFileContent = (
    branchId: string | undefined,
    path: string
) => {
    const { axios } = useAxios();
    return useQuery({
        queryKey: ['file-content', branchId, path],
        queryFn: () => axios.get(`/branches/${branchId}/tree/file/${encodeURIComponent(path)}`).then(res => res.data),
        initialData: null
    })
}