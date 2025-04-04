import { ibmEgaFont } from "@/app/styles/font"

interface Props {
    sender: string
    recipient: string
    message: string
    timestamp: string
}

export default function PrivateChatMessage({sender, recipient, message, timestamp}: Props) {

    const formatTimeStamp = (): string => {
        const date = new Date(timestamp)
        return date.toLocaleTimeString(navigator.language, {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(',', '')  
    }
 
    return (
        <div className={`${ibmEgaFont.className} break-all max-w-full overflow-hidden`}>
            <span className="text-cyan-400 text-sm">[{formatTimeStamp()}] </span>
            <span className="text-lime-300">@{sender} </span> <br/>
            <span className="select-none">{'> '}</span><span className="text-white">{message}</span>
        </div>
    )
}