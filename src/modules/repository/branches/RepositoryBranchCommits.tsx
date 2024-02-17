import { useParams } from "react-router"
import { useListCommits } from "../../../api/query/branch/useListCommits"
import { Commit } from "../../../components/commit/Commit"
export const RepositoryBranchCommits = () => {
    const { branchId } = useParams()
    const { data: commits } = useListCommits(branchId);

    return <div className="w-full flex flex-col gap-2 p-3">
        {
            commits?.map((c) => <Commit commit={c} />)
        }
    </div>
}