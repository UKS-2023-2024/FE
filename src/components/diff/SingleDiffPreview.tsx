import { MinusIcon, PlusIcon } from "lucide-react";
import { Diff, Hunk, FileData } from "react-diff-view"
import 'react-diff-view/style/index.css';
import { useGetFileContent } from "../../api/query/files/useGetFileContent";
interface Props {
    file: FileData
}

export const SingleDiffPreview = ({ file }: Props) => {
    const renderFile = ({ oldRevision, newRevision, type, hunks }: any) => (
        <Diff key={oldRevision + '-' + newRevision} viewType="split" diffType={type} hunks={hunks}>
            {hunks => hunks.map(hunk => <Hunk key={hunk.content} hunk={hunk} />)}
        </Diff>
    );

    return <div className="flex flex-col w-full">
        <div className="flex flex-wrap gap-2 w-full min-h-10 p-2 border border-solid border-white text-white break-all">
            {
                file.type === 'add' && <PlusIcon className="text-green-500" />
            }
            {
                file.type === 'delete' && <MinusIcon className="text-red-500" />
            }
            {
                file.type === 'modify' && <PlusIcon className="text-blue-500" />
            }

            <h2>{file.oldPath === '/dev/null' ? '' : file.oldPath}</h2>
            <div>{"->"}</div>
            <h2>{file.newPath === '/dev/null' ? '' : file.newPath}</h2>
        </div>
        <div>
            {renderFile(file)}
        </div>
    </div>
}