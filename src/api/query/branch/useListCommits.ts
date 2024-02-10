import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios"

export const useListCommits = (
    branchId?: string | null
) => {
    const { axios } = useAxios();
    return useQuery<CommitResponse[]>({
        queryKey: ['commits', branchId],
        queryFn: () => axios.get(`/branches/${branchId}/commits`).then(res => res.data),
        initialData: []
    })
}


type CommitResponse = {
    sha: string;
    committer?: string;
    createdAt: string,
    additions: number,
    deletions: number,
    message: string
}