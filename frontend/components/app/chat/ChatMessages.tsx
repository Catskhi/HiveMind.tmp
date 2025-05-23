'use client'
import { useEffect, useMemo, useRef } from "react"
import { useChat } from "./ChatProvider"
import GlobalChatMessage from "./GlobalChatMessage"
import PrivateChatMessage from "./PrivateChatMessage"

export const ChatMessages = () => {
    const { globalMessages, privateMessages, chatName, isGlobalChat } = useChat()
    const containerRef = useRef<HTMLDivElement>(null)

    const messages = useMemo(() => {
        return isGlobalChat ? globalMessages : privateMessages
    }, [isGlobalChat, globalMessages, privateMessages])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [messages])

    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="p-4 border-b border-[#9b9b9b] bg-black/45 sticky top-0 z-10">
                {chatName} {isGlobalChat ? '' : '- Private Chat'}
            </div>
            <div className="flex-1 overflow-y-auto p-4 mb-16" ref={containerRef}>
                <div className="flex flex-col gap-y-4">
                    {isGlobalChat && globalMessages.map((message, index) => (
                        <GlobalChatMessage 
                            key={index} 
                            username={message.username} 
                            message={message.message}
                            timestamp={message.timestamp} />
                    ))}
                    {!isGlobalChat && privateMessages.map((message, index) => (
                        <PrivateChatMessage 
                            key={index} 
                            sender={message.sender} 
                            recipient={message.recipient}
                            message={message.message ?? ''}
                            timestamp={message.timestamp} />
                    ))}
                </div>
            </div>
        </div>
    )
}