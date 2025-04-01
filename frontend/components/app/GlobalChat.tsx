'use client'
import { Client } from "@stomp/stompjs"
import { useEffect, useState, useCallback } from "react"

export default function GlobalChat() {
    const baseWebsocketUrl: string = process.env.NEXT_PUBLIC_BACKEND_BASE_WEBSOCKET_URL as string
    const [messages, setMessages] = useState<string[]>([])
    const [inputMessage, setInputMessage] = useState("")
    const [client, setClient] = useState<Client | null>(null)

    useEffect(() => {
        const client = new Client({
            brokerURL: baseWebsocketUrl,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connected!")
                client.subscribe("/topic/globalChat", (message) => {
                    setMessages((prev) => [...prev, message.body])
                })
            },
            onStompError: (error) => {
                console.log("STOMP error:", error)
            }
        })
        client.activate()
        setClient(client);

        return () => {
            if (client) {
                client.deactivate();
            }
        }
    }, [])

    // Send message handler
    const sendMessage = () => {
        if (inputMessage && client) {
            client.publish({
                destination: '/app/globalChat',
                body: inputMessage
            })
            setInputMessage("")
        }
    }

    return (
        <div className="chat-container h-full">
            <h2 className="text-lg mx-4">Global Chat</h2>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    )
}