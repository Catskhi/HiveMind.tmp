'use client'

import { Client, Message } from "@stomp/stompjs"
import { createContext, useContext, useEffect, useState } from "react"

interface ChatContextType {
    messages: MessageType[]
    sendMessage: (content: string) => void
    isConnected: boolean
}

interface MessageType {
    username: string
    message: string
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: {children: React.ReactNode}) {
    const baseWebsocketUrl: string = process.env.NEXT_PUBLIC_BACKEND_BASE_WEBSOCKET_URL as string
    const [client, setClient] = useState<Client | null>(null)
    const [messages, setMessages] = useState<MessageType[]>([])
    const [isConnected, setIsConnected] = useState<boolean>(false)

    useEffect(() => {
        const client = new Client({
            brokerURL: baseWebsocketUrl,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected')
                setIsConnected(true);
                client.subscribe("/topic/globalChat", (message: Message) => {
                    const messageData: MessageType = JSON.parse(message.body)
                    console.log(JSON.parse(message.body))
                    setMessages(prev => [...prev, {
                        username: messageData.username,
                        message: messageData.message
                    }])
                })
            },
            onDisconnect: () => setIsConnected(false)
        })

        client.activate()
        setClient(client)

        return () => {
            client.deactivate()
        }
    }, [])

    const sendMessage = (content: string) => {
        if (client && isConnected) {
            client.publish({
                destination: '/app/globalChat',
                body: content,
            })
        }
    }

    return (
        <ChatContext.Provider value={{messages, sendMessage, isConnected}} >
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => {
    const context = useContext(ChatContext)
    if (!context) throw new Error('useChat must be used within ChatProvider');
    return context
}