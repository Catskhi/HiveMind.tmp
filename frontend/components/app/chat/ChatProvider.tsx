'use client'

import { Client, Message } from "@stomp/stompjs"
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useAuth } from "../auth/AuthProvider"
import { decryptMessage, encryptMessage } from "@/utils/cryptoutils"

interface ChatContextType {
    globalMessages: GlobalMessageType[]
    privateMessages: PrivateMessageType[]
    sendMessage: (content: string) => void
    recipient:RecipientType
    setRecipient: (recipient: RecipientType) => void
    isConnected: boolean
    changeChat: (isGlobal: boolean, chatRecipient: RecipientType) => void
    chatName: string
    isGlobalChat: boolean
    unreadMessages: MessageNotification[]
}

interface RecipientType {
    name: string
    publicKey: string
}

interface GlobalMessageType {
    username: string
    message: string
    timestamp: string
}

interface PrivateMessageType {
    sender: string
    recipient: string
    encryptedMessage: string
    encryptedKeySender: string
    encryptedKeyRecipient: string
    iv: string
    timestamp: string
    message?: string
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
    const [recipient, setRecipient] = useState<RecipientType | null>(null)
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

    const handlePrivateMessages = useCallback(async (message: Message) => {
        const messageData: PrivateMessageType = JSON.parse(message.body)
        console.log('New private message')
        console.log(messageData)
        console.log(`RECIPIENT: ${recipient?.name}`)

        const decryptionKey = messageData.sender === userName ? messageData.encryptedKeySender : messageData.encryptedKeyRecipient;
        const privateKey = sessionStorage.getItem('privateKey')
        if (!privateKey) throw new Error("")

        const decryptedMessage = await decryptMessage(
            messageData.encryptedMessage,
            decryptionKey,
            messageData.iv,
            privateKey
        )

        if (messageData.sender === recipient?.name) {
            setPrivateMessages(prev => [...prev, {
                ...messageData,
                message: decryptedMessage
            }])
        } else {
            if (messageData.sender == userData?.name) {
                setPrivateMessages(prev => [...prev, {
                    ...messageData,
                    message: decryptedMessage
                }])
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
    }, [recipient, userName])

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
                if (isGlobalChat) changeChat(true);
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

    const changeChat = (isGlobal: boolean, chatRecipient?: RecipientType) => {
        if (isGlobal) {
            setIsGlobalChat(true);
            setChatName('Global Chat')
            setRecipient(null)
            return
        }
        try {
            if (!chatRecipient) throw new Error("Recipient name is mandatory on non global chats.");
            setIsGlobalChat(false);
            setChatName(chatRecipient.name);
            setRecipient(chatRecipient);
            console.log(`Chat changed to: ${chatRecipient.name}`);
        } catch (error) {
            console.log(`An error occurred: ${error}`)
        }
    }


    const sendMessage = async (content: string) => {
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

            const { encryptedMessage, encryptedKeySender, encryptedKeyRecipient, iv } = await encryptMessage(content, userData!.publicKey, recipient!.publicKey)

            clientRef.current.publish({
                destination: destination,
                body: JSON.stringify({
                    recipient: recipient?.name,
                    encryptedKeySender,
                    encryptedKeyRecipient,
                    encryptedMessage,
                    iv
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
            recipient,
            setRecipient,
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