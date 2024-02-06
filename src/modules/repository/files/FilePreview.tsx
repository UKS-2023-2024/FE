import { useEffect, useMemo } from "react"
import { useGetFileContent } from "../../../api/query/files/useGetFileContent"


interface ImageFilePreviewProps {
    content: string
    extension: string
}
export const ImageFilePreview = ({ content, extension }: ImageFilePreviewProps) => {
    const convertToBase64Preview = () => {
        return `data:image/${extension};base64, ${content}`
    }
    return <div className="flex items-center justify-center w-full">
        <img className="w-[300px] h-[300px]" src={convertToBase64Preview()} />
    </div>
}

export interface Props {
    branchId?: string
    path: string
}

export const FilePreview = ({ path, branchId }: Props) => {

    const { data: file } = useGetFileContent(branchId, path)

    const extension = useMemo(() => {
        if (!file) return null;
        const fileChunks = file?.name.split('.');
        return fileChunks[fileChunks.length - 1]
    }, [file]);
    const imageExtensions = ['jpg', 'jpeg', 'png', 'svg']


    return <div className="w-3/4 mx-auto">

        <div className="flex flex-col gap-4 text-white border border-gray-500 rounded-lg p-4">
            <h2 className="text-white text-sm border-b border-b-gray-500 py-3">{file?.name}</h2>
            <p>
                {
                    imageExtensions.includes(extension) &&
                    <ImageFilePreview extension={extension} content={file?.content} />
                }
                {
                    !imageExtensions.includes(extension) &&
                    file?.content
                }
            </p>
        </div>

    </div>
}