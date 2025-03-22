'use client'
import FormTextInput from "@/components/forms/FormTextInput";
import { useChat } from "./ChatProvider";
import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";

interface Props {
    username: string
}


export default function ChatInput({ username }: Props) {
    const { sendMessage, sendPrivateMessage, recipientName, setRecipientName } = useChat()
    const [inputValue, setInputValue] = useState<string>('')

    const handleSend = () => {
        if (inputValue.trim()) {
            sendPrivateMessage(inputValue.trim())
            setInputValue('')
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="p-4 flex items-center">
            ({username}@hivemind.tmp) <span className="mx-2">$</span> 
            <FormTextInput 
                onKeyDown={handleKeyDown}
                className="w-1/2 flex-1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <FormTextInput 
                onKeyDown={handleKeyDown}
                placeholder="Recipiant Name"
                className="w-1/2 flex-1 border-b-green-500"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
            />
            <button className="px-2 ml-2 self-center"
                onClick={handleSend}
            >
                Send
            </button>
        </div>
    )
}