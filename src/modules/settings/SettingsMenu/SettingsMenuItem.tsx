import { cn } from "../../../utils/cn"

export interface Props {
    content: string,
    onClick: () => void
    className?: string,
}

export const SettingsMenuItem = ({ content, onClick, className }: Props) => {
    return <div
        className={cn("w-full flex align-center justify-center border cursor-pointer border-white rounded p-2 text-white bg-gray-700 hover:bg-gray-600", className)}
        onClick={onClick}>
        <span>{content}</span>
    </div>
}