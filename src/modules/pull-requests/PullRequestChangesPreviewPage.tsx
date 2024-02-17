import { useParams } from "react-router-dom"
import { useGetPrDiff } from "../../api/query/pull-request/useGetPrDiff"
import { GitDiffPreview } from "../../components/diff/GitDiffPreview"
import { useGetPullRequest } from "../../api/query/pull-request/useGetPullRequest"

export const PullRequestChangesPreviewPage = () => {
    const { id } = useParams()
    const { data: pr } = useGetPullRequest(id)
    const { data: diff } = useGetPrDiff(id)

    return <div className="flex flex-col gap-2 p-10">
        <div className="flex items-center gap-4 pb-2">
            <div className="text-3xl text-white">{pr?.title ?? ""}</div>
            <div className="text-3xl text-gray-500">#{pr?.number}</div>
        </div>
        <div className="w-full">
            <GitDiffPreview diff={diff} />
        </div>
    </div>
}