import { useParams } from "react-router"
import { useListCommits } from "../../../api/query/branch/useListCommits"
import { format } from "date-fns"
export const RepositoryBranchCommits = () => {
    const { branchId } = useParams()
    const { data: commits } = useListCommits(branchId);

    return <div className="w-full flex flex-col gap-2 p-3">
        {
            commits?.map((c) =>
                <div className="w-1/2 border border-white min-h-10 flex flex-col gap-1 text-white m-auto p-2 rounded">
                    <div className="flex gap-1">
                        <span>Sha:</span>
                        <span>{c.sha}</span>
                    </div>
                    <div className="flex gap-1">
                        <span>Created At:</span>
                        <span>{format(c.createdAt, 'dd/MM/yyyy HH:mm')}</span>
                    </div>
                    <div className="flex gap-1">
                        <span>Committer:</span>
                        <span>{c.committer ?? "Web Flow"}</span>
                    </div>
                    <div className="flex gap-1">
                        <span>Message:</span>
                        <span>{c.message}</span>
                    </div>
                    <div className="flex gap-1">
                        <span>Additions:</span>
                        <span>{c.additions}</span>
                    </div>
                    <div className="flex gap-1">
                        <span>Deletions:</span>
                        <span>{c.deletions}</span>
                    </div>
                </div>)
        }
    </div>
}