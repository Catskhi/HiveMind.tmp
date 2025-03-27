"use client";

import { useEffect } from "react";
import FormTextInput from "../forms/FormTextInput";
import { useChat } from "./chat/ChatProvider";

type Contact = {
  id: string;
  name: string;
  status: 'online' | 'offline';
  unread: number;
  keyValid: boolean;
};

interface Props {
    className?: string
}

export default function ContactsSidebar({className}: Props) {
    const { unreadMessages, recipientName } = useChat()

    useEffect(() => {
        console.log(unreadMessages)
    }, [unreadMessages])
    
    return (
        <div className={className + ' w-64 border-[#9b9b9b]'}>
            <div className="px-4 mt-4">
                <FormTextInput placeholder="Search... " className="border-[1px] p-2" />
            </div>
            {unreadMessages.map((unreadMessage) => (
                    <li key={unreadMessage.sender} className="flex justify-between p-2 border-b border-gray-300">
                        <span>{unreadMessage.sender}</span>
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                            {unreadMessage.count}
                        </span>
                    </li>
                ))}
        </div>
    )
}