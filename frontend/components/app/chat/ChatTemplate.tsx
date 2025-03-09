
interface Props {
    children: React.ReactNode
}

export default function ChatTemplate({ children }: Props) {
    return (
        <div className="flex flex-col flex-1 px-4">
            {children}
        </div>
    )
}