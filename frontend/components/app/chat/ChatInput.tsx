'use client'
import FormTextInput from "@/components/forms/FormTextInput";
import { useChat } from "./ChatProvider";
import { useState } from "react";

interface Props {
    username: string
}


export default function ChatInput({ username }: Props) {
    const { sendMessage } = useChat()
    const [inputValue, setInputValue] = useState<string>('')

    const handleSend = () => {
        if (inputValue.trim()) {
            sendMessage(inputValue.trim())
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
        <div className="p-4 flex items-center h-16 max-h-16">
            <div className="hidden md:flex">
                <div className="truncate">
                    (<span className="text-lime-300">{username}</span>
                </div>
                @hivemind.tmp) <span className="mx-2">$</span> 
            </div>
            <FormTextInput 
                maxLength={500}
                placeholder="Your message here..."
                onKeyDown={handleKeyDown}
                className="w-1/2 flex-1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button className="px-2 ml-2 self-center cursor-pointer hover:text-[#C0C0C0] disabled:text-[#7070disabled70]"
                disabled={inputValue.length <= 500 ? false : true}
                onClick={handleSend}
            >
                Send
            </button>
        </div>
    )
}