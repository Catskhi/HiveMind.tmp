'use client'

import { Client, Message } from "@stomp/stompjs"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "../auth/AuthProvider"

interface ChatContextType {
    messages: MessageType[]
    sendMessage: (content: string) => void
    sendPrivateMessage: (content: string) => void
    setRecipientName: (name: string) => void
    recipientName: string
    isConnected: boolean
}

interface MessageType {
    username: string
    message: string
    timestamp: string
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: {children: React.ReactNode}) {
    const baseWebsocketUrl: string = process.env.NEXT_PUBLIC_BACKEND_BASE_WEBSOCKET_URL as string
    const { userData } = useAuth()
    const [client, setClient] = useState<Client | null>(null)
    const [messages, setMessages] = useState<MessageType[]>([])
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [recipientName, setRecipientName] = useState<string>("")
    const [recipientUrl, setRecipientUrl] = useState<string>("")

    useEffect(() => {
        const client = new Client({
            brokerURL: baseWebsocketUrl,
            reconnectDelay: 5000,
            onConnect: () => {
                setRecipientUrl("/app/globalChat");
                setIsConnected(true);
                client.subscribe(`/user/${userData!.name}/queue/messages`, (message: Message) => {
                    console.log("================= PRIVATE MESSAGE ===========")
                    console.log(JSON.parse(message.body))
                })
                client.subscribe("/topic/globalChat", (message: Message) => {
                    const messageData: MessageType = JSON.parse(message.body)
                    console.log(JSON.parse(message.body))
                    setMessages(prev => [...prev, {
                        username: messageData.username,
                        message: messageData.message,
                        timestamp: messageData.message
                    }])
                })
            },
            onDisconnect: () => setIsConnected(false)
        })

        if (userData) {
            client.activate()
            setClient(client)
        }

        return () => {
            client.deactivate()
        }
    }, [userData])

    const sendPrivateMessage = (content: string) => {
        if (client && isConnected) {
            client.publish({
                destination: "/app/privateMessage",
                body: JSON.stringify({
                    recipient: recipientName,
                    message: content
                })
            })
        }
        
    }

    const sendMessage = (content: string) => {
        if (client && isConnected) {
            client.publish({
                destination: '/app/globalChat',
                body: content,
            })
        }
    }

    return (
        <ChatContext.Provider 
        value={{
            messages,
            sendMessage,
            sendPrivateMessage,
            isConnected,
            recipientName,
            setRecipientName
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => {
    const context = useContext(ChatContext)
    if (!context) throw new Error('useChat must be used within ChatProvider');
    return context
}