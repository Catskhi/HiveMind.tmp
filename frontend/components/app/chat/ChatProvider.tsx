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
    changeChat: (isGlobal: boolean, chatRecipient?: RecipientType) => void
    chatName: string
    isGlobalChat: boolean
    unreadMessages: MessageNotification[]
    fetchContacts: () => void
    contacts: Contact[]
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

interface Contact {
    contact: {
        name: string
        publicKey: string
    }
    lastMessageAt: string
    // add isOnline later
    unreadMessagesCount: number
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: {children: React.ReactNode}) {
    const baseBackendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
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
    const [contacts, setContacts] = useState<Contact[]>([]);

    const fetchContacts = useCallback(async () => {
        try {
            const response = await fetch(`${baseBackendUrl}/contacts`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch contacts');
            const data: Contact[] = await response.json();
            setContacts(data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    }, [baseBackendUrl]);

    const fetchPrivateMessages = useCallback(async (recipientName: string) => {
        setPrivateMessages([]);
        try {
            const response = await fetch(`${baseBackendUrl}/contacts/${recipientName}/messages`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch messages');
            const data: PrivateMessageType[] = await response.json();
            const decryptedMessages = await Promise.all(
                data.map(async (msg) => {
                    try {
                        const decryptionKey = msg.sender === userName ? msg.encryptedKeySender : msg.encryptedKeyRecipient;
                        const privateKey = sessionStorage.getItem('privateKey')
                        const decryptedMessage = await decryptMessage(msg.encryptedMessage, decryptionKey, msg.iv, privateKey);
                        return { ...msg, message: decryptedMessage };
                    } catch (error) {
                        console.log(error)
                    }
                })
            )
            setPrivateMessages(decryptedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }, [baseBackendUrl, recipient])

    const fetchGlobalMessages = useCallback(async () => {
        setGlobalMessages([])
        try {
            const response = await fetch(`${baseBackendUrl}/globalChat/messages`, {
                credentials: 'include'
            })
            if (!response.ok) throw new Error('Falied to fetch globalMessages');
            const data = await response.json();
            setGlobalMessages(data);
        } catch (error) {
            console.error('Error fetching global messages:', error);
        }
    })
    
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
        const decryptionKey = messageData.sender === userName ? messageData.encryptedKeySender : messageData.encryptedKeyRecipient;
        const privateKey = sessionStorage.getItem('privateKey')
        if (!privateKey) throw new Error("No private key found.")

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
            clientRef.current?.publish({
                destination: '/app/chat/mark-read',
                body: JSON.stringify({ contactUsername: messageData.sender })
            });
            fetchContacts()
        } else {
            if (messageData.sender == userData?.name) {
                setPrivateMessages(prev => [...prev, {
                    ...messageData,
                    message: decryptedMessage
                }])
                return
            }
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

        const contactsSub = client.subscribe('/user/queue/contacts', (message) => {
            const updatedContact = JSON.parse(message.body);
            setContacts(prevContacts => {
                const filtered = prevContacts.filter(contact => 
                    contact.contact.name !== updatedContact.contact.name
                );
                return [updatedContact, ...filtered];
            })
        })
        subscriptionsRef.current.push(contactsSub);
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
            fetchGlobalMessages()
            setIsGlobalChat(true);
            setChatName('Global Chat')
            setRecipient(null)
            return
        }
        try {
            if (!chatRecipient) throw new Error("Recipient name is mandatory on non global chats.");
            if (!clientRef) throw new Error("No client provided.")
            setIsGlobalChat(false);
            setChatName(chatRecipient.name);
            setRecipient(chatRecipient);
            fetchPrivateMessages(chatRecipient.name);
            clientRef.current?.publish({
                destination: '/app/chat/mark-read',
                body: JSON.stringify({ contactUsername: chatRecipient.name })
            });
            fetchContacts()
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
                body: JSON.stringify({
                    message: content
                })
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
            unreadMessages,
            fetchContacts,
            contacts
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