import { format } from "date-fns"
import { MinusIcon, PlusIcon } from "lucide-react"
interface Props {
    commit: any
}
export const Commit = ({ commit }: Props) => {
    return <div className="flex p-2 border border-gray-700 rounded-sm relative">
        <div className="flex flex-col gap-1 p-1 pr-3 items-center">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-900 border border-white text-white">
                {commit?.committer ? commit?.committer[0].toUpperCase() : "N"}
            </div>
            <div className="text-white text-xs">
                {commit?.committer}
            </div>
        </div>
        <div className="flex flex-col gap-1 grow">
            <div className="flex gap-4">
                <div>
                    <label htmlFor="" className="text-gray-500">Sha:</label>
                    <div className="text-white text-xs">{commit.sha}</div>
                </div>
                <div>
                    <label htmlFor="" className="text-gray-500">Created At:</label>
                    <div className="text-white text-xs">{format(commit.createdAt, 'dd/MM/yyyy HH:mm')}</div>
                </div>
            </div>
            <div>
                <label htmlFor="" className="text-gray-500">Message:</label>
                <div className="text-white text-xs">{commit.message}</div>
            </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-2">
            <div className="flex">
                <PlusIcon className="text-green-500" />
                <span className="text-white">{commit.additions}</span>
            </div>
            <div className="flex">
                <MinusIcon className="text-red-500" />
                <span className="text-white">{commit.deletions}</span>
            </div>
        </div>
    </div>
}