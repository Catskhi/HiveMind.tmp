'use client'

import { Client, Message } from "@stomp/stompjs"
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useAuth } from "../auth/AuthProvider"

interface ChatContextType {
    messages: MessageType[]
    sendMessage: (content: string) => void
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
    const clientRef = useRef<Client | null>(null);
    const subscriptionsRef = useRef<Array<{ unsubscribe: () => void }>>([])
    const [messages, setMessages] = useState<MessageType[]>([])
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [recipientName, setRecipientName] = useState<string>("")
    const [isGlobalChat, setIsGlobalChat] = useState<boolean>(true)
    
    const handleMessage = useCallback((message: Message) => {
        const messageData: MessageType = JSON.parse(message.body)
        setMessages(prev => [...prev, {
            username: messageData.username,
            message: messageData.message,
            timestamp: messageData.timestamp
        }])
    })

    const setupSubscriptions = useCallback((client: Client) => {
        if (!userData?.name) return

        subscriptionsRef.current.forEach(sub => sub.unsubscribe)
        subscriptionsRef.current = []

        const globalSub = client.subscribe("/topic/globalChat", handleMessage)
        subscriptionsRef.current.push(globalSub)

        const privateSub = client.subscribe(
            '/user/queue/messages',
            (message: Message) => {
                console.log('Private message:', JSON.parse(message.body))
            }
        )
        subscriptionsRef.current.push(privateSub)
    }, [userData])

    useEffect(() => {
        if (!userData?.name) return

        const client = new Client({
            brokerURL: baseWebsocketUrl,
            reconnectDelay: 5000,
            onConnect: () => {
                setIsConnected(true)
                setupSubscriptions(client)
            },
            onDisconnect: () => setIsConnected(false)
        })
        
        clientRef.current = client
        client.activate()

        return () => {
            client.deactivate()
            subscriptionsRef.current = []
        }
    }, [userData, baseWebsocketUrl, setupSubscriptions])


    const sendMessage = (content: string) => {
        if (!clientRef.current || !isConnected) return;

        const destination: string = isGlobalChat
        ? '/app/globalChat'
        : '/app/privateMessage'

        if (isGlobalChat) {
            clientRef.current.publish({
                destination: destination,
                body: content
            })
        } else {
            clientRef.current.publish({
                destination: destination,
                body: JSON.stringify({
                    recipient: recipientName,
                    message: content
                })
            })
        }
    }

    return (
        <ChatContext.Provider 
        value={{
            messages,
            sendMessage,
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