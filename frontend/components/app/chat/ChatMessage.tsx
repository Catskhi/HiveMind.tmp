
interface Props {
    username: string
    message: string
}

export default function ChatMessage({username, message}: Props) {
    return (
        <div>
            ({username}): {message}
        </div>
    )
}