import { ibmEgaFont } from "@/app/styles/font"

interface Props {
    username: string
    message: string
    timestamp: string
}

export default function ChatMessage({username, message, timestamp}: Props) {

    const formatTimeStamp = (): string => {
        const date = new Date(timestamp)
        return date.toLocaleTimeString(navigator.language, {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })   
    }
 
    return (
        <div className={ibmEgaFont.className}>
            <span className="text-cyan-400 text-sm">[{formatTimeStamp()}] </span>
            <span className="text-lime-300 text-sm">@{username} </span> <br/>
            <span className="select-none">{'> '}</span><span className="text-white">{message}</span>
        </div>
    )
}