import TextButton from "../ui/TextButton"
import { useChat } from "./chat/ChatProvider"


interface Props {
    sender: string
    count: number
}

export default function Contact({ sender, count }: Props) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
    const { changeChat } = useChat()

    const openContactChat = async () => {
        const response = await fetch(baseUrl + '/user/' + sender, {
            credentials: 'include'
        })
        const data = await response.json()
        console.log(data)
        changeChat(false, {name: sender, publicKey: data.publicKey})
    }

    return (
        <div className="border-b py-2 px-1 flex justify-between">
            <span>
                <TextButton onClick={openContactChat}>{sender}</TextButton>
            </span>
            <span className="text-lime-400">
                [{count}]
            </span>
        </div>
    )
}