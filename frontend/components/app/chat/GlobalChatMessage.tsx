'use client'

import { ibmEgaFont } from "@/app/styles/font"
import { useChat } from "./ChatProvider"
import { useAuth } from "../auth/AuthProvider"

interface Props {
    username: string
    message: string
    timestamp: string
}

export default function GlobalChatMessage({username, message, timestamp}: Props) {
    const { userData } = useAuth()
    const { changeChat } = useChat()
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

    const changeToUserChat = async () => {
        try {
            if (userData?.name === username) return;
            const response = await fetch(baseUrl + '/user/' + username, {
                credentials: 'include'
            });
            const data = await response.json();
            if (response.status === 404) {
                throw new Error("You must type a valid user name")
            }
            if (!response.ok) {
                throw new Error(data.message);
            }
            changeChat(false, {name: username, publicKey: data.publicKey})
        } catch (request_error) {
            const error = request_error as Error;
            console.log("An error occurred on message: " + error.message);
        }
    }

    const formatTimeStamp = (): string => {
        const date = new Date(timestamp)
        return date.toLocaleTimeString(navigator.language, {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(',', '')  
    }
 
    return (
        <div className={`${ibmEgaFont.className} break-all max-w-full overflow-hidden`}>
            <span className="text-cyan-400 text-sm">[{formatTimeStamp()}] </span>
            <span onClick={changeToUserChat} className={`text-lime-300 ${userData?.name !== username ? 'hover:text-lime-500 cursor-pointer' : ''}`}>@{username} </span> <br/>
            <span className="select-none">{'> '}</span><span className="text-white">{message}</span>
        </div>
    )
}