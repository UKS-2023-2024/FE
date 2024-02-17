import { useParams } from "react-router-dom"
import { useGetPullRequest } from "../../api/query/pull-request/useGetPullRequest"
import { useGetPrCommits } from "../../api/query/pull-request/useGetPrCommits"
import { Commit } from "../../components/commit/Commit"

export const PullRequestCommitPreviewPage = () => {
    const { id } = useParams()
    const { data: pr } = useGetPullRequest(id)
    const { data: commits } = useGetPrCommits(id)

    return <div className="flex flex-col gap-2 p-10">
        <div className="flex items-center gap-4 pb-2">
            <div className="text-3xl text-white">{pr?.title ?? ""}</div>
            <div className="text-3xl text-gray-500">#{pr?.number}</div>
        </div>
        <div className="w-full flex flex-col gap-1">
            {
                commits?.map((commit) => <Commit commit={commit} />)
            }
        </div>
    </div>
}