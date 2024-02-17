import { parseDiff, FileData } from "react-diff-view"
import { useMemo, useState } from "react"
import { SingleDiffPreview, } from "./SingleDiffPreview"

interface Props {
    diff: string
}
export const GitDiffPreview = ({ diff }: Props) => {

    const files = useMemo(() => {
        if (!diff) return []
        const parsed = parseDiff(diff)
        console.log(parsed)
        return parsed
    }, [diff])

    return <div className="flex flex-col gap-2 w-full h-full p-2 ">
        <h2 className='text-lg text-white'>File Changes:</h2>
        {
            files.map((file: FileData) => <SingleDiffPreview file={file} />)
        }
    </div>
}