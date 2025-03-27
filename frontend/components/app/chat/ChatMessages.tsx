'use client'
import { useEffect, useMemo } from "react"
import { useChat } from "./ChatProvider"
import GlobalChatMessage from "./GlobalChatMessage"
import PrivateChatMessage from "./PrivateChatMessage"

export const ChatMessages = () => {
    const { globalMessages, privateMessages, chatName, isGlobalChat } = useChat()

    const messages = useMemo(() => {
        return isGlobalChat ? globalMessages : privateMessages
    }, [isGlobalChat, globalMessages, privateMessages])
    
    useEffect(() => {
        console.log(messages)
    }, [messages])

    return (
        <div className="flex-1 pt-3 overflow-auto">
            <div className="pt-3 pb-5">
                { chatName }, {isGlobalChat ? 'true' : 'false'}
            </div>
            <div className="flex flex-col gap-y-3">
                
                {isGlobalChat && messages.map((message, index) => (
                    <GlobalChatMessage 
                    key={index} 
                    username={message.username} 
                    message={message.message}
                    timestamp={message.timestamp} />
                ))}
                {!isGlobalChat && messages.map((message, index) => (
                    <PrivateChatMessage 
                    key={index} 
                    sender={message.sender} 
                    recipient={message.recipient}
                    message={message.message}
                    timestamp={message.timestamp} />
                ))}
            </div>
        </div>
    )
}