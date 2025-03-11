'use client'
import ChatMessage from "./ChatMessage"
import { useChat } from "./ChatProvider"

export const ChatMessages = () => {
    const { messages } = useChat()
    return (
        <div className="flex-1 pt-3 overflow-auto">
            <div className="flex flex-col gap-y-3">
                {messages.map((message, index) => (
                    <ChatMessage key={index} 
                    username={message.username} 
                    message={message.message}
                    timestamp={message.timestamp} />
                ))}
            </div>
        </div>
    )
}