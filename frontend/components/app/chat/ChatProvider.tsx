'use client'

import { Client, Message } from "@stomp/stompjs"
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useAuth } from "../auth/AuthProvider"

interface ChatContextType {
    globalMessages: GlobalMessageType[]
    privateMessages: PrivateMessageType[]
    sendMessage: (content: string) => void
    setRecipientName: (name: string) => void
    recipientName: string
    isConnected: boolean
    changeChat: (isGlobal: boolean, chatRecipientName?: string) => void
    chatName: string
    isGlobalChat: boolean
    unreadMessages: MessageNotification[]
}

interface GlobalMessageType {
    username: string
    message: string
    timestamp: string
}

interface PrivateMessageType {
    sender: string
    recipient: string
    message: string
    timestamp: string
}

interface MessageNotification {
    sender: string
    count: number
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: {children: React.ReactNode}) {
    const baseWebsocketUrl: string = process.env.NEXT_PUBLIC_BACKEND_BASE_WEBSOCKET_URL as string
    const { userData } = useAuth()
    const userName = userData?.name
    const clientRef = useRef<Client | null>(null);
    const subscriptionsRef = useRef<Array<{ unsubscribe: () => void }>>([])
    const [globalMessages, setGlobalMessages] = useState<GlobalMessageType[]>([])
    const [privateMessages, setPrivateMessages] = useState<PrivateMessageType[]>([])
    const [unreadMessages, setUnreadMessages] = useState<MessageNotification[]>([])
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [recipientName, setRecipientName] = useState<string>("")
    const [isGlobalChat, setIsGlobalChat] = useState<boolean>(true)
    const [chatName, setChatName] = useState<string>("");
    
    const handleGlobalMessages = useCallback((message: Message) => {
        const messageData: GlobalMessageType = JSON.parse(message.body)
        setGlobalMessages(prev => [...prev, {
            username: messageData.username,
            message: messageData.message,
            timestamp: messageData.timestamp
        }])
        return
    }, [])

    const handlePrivateMessages = useCallback((message: Message) => {
        const messageData: PrivateMessageType = JSON.parse(message.body)
        console.log('New private message')
        console.log(messageData)
        if (messageData.sender === recipientName) {
            setPrivateMessages(prev => [...prev, {
                sender: messageData.sender,
                recipient: messageData.recipient,
                message: messageData.message,
                timestamp: messageData.timestamp
            }])
        } else {
            console.log(messageData)
            console.log(userName)
            if (messageData.sender == userData?.name) {
                console.log('HIII')
                return
            }
            setUnreadMessages(prev => {
                const existing = prev.find(msg => msg.sender === messageData.sender)
                if (existing) {
                    return prev.map(msg => 
                        msg.sender === messageData.sender
                        ? { ...msg, count: msg.count + 1 }
                        : msg
                    )
                } else {
                    return [...prev, { sender: messageData.sender, count: 1 }]
                }
            })
        }
    }, [])

    const setupSubscriptions = useCallback((client: Client) => {
        if (!userName) return

        subscriptionsRef.current.forEach(sub => sub.unsubscribe)
        subscriptionsRef.current = []

        const globalSub = client.subscribe("/topic/globalChat", handleGlobalMessages)
        subscriptionsRef.current.push(globalSub)

        const privateSub = client.subscribe('/user/queue/messages', handlePrivateMessages)
        subscriptionsRef.current.push(privateSub)
    }, [userData, handleGlobalMessages, handlePrivateMessages])

    useEffect(() => {
        if (!userName) return

        const client = new Client({
            brokerURL: baseWebsocketUrl,
            reconnectDelay: 5000,
            onConnect: () => {
                setIsConnected(true)
                setupSubscriptions(client)
                changeChat(true)
            },
            onDisconnect: () => setIsConnected(false)
        })
        
        clientRef.current = client
        client.activate()

        return () => {
            client.deactivate()
            subscriptionsRef.current = []
        }
    }, [userName, baseWebsocketUrl, setupSubscriptions])

    const changeChat = (isGlobal: boolean, chatRecipientName?: string) => {
        setIsGlobalChat(isGlobal)
        if (isGlobal) {
            setIsGlobalChat(true);
            setChatName('Global Chat')
            setRecipientName('')
            return
        }
        try {
            if (!chatRecipientName) throw new Error("Recipient name is mandatory on non global chats.");
            setChatName(chatRecipientName);
            setRecipientName(chatRecipientName);
        } catch (error) {
            console.log(`An error occurred: ${error}`)
        }
    }


    const sendMessage = (content: string) => {
        if (!clientRef.current || !isConnected) return;

        const destination: string = isGlobalChat
        ? '/app/globalChat'
        : '/app/chat'

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
            globalMessages,
            privateMessages,
            sendMessage,
            isConnected,
            recipientName,
            setRecipientName,
            changeChat,
            chatName,
            isGlobalChat,
            unreadMessages
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