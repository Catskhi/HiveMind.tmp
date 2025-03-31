"use client";

import { useEffect } from "react";
import FormTextInput from "../forms/FormTextInput";
import { useChat } from "./chat/ChatProvider";
import Contact from "./Contact";

interface Props {
    className?: string
}

export default function ContactsSidebar({className}: Props)  {
    const { contacts, fetchContacts } = useChat()

    useEffect(() => {
        fetchContacts()
    }, [])
    
    return (
        <div className={className + ' w-64 border-[#9b9b9b]'}>
            <div className="mt-4 w-64 px-2">
                <FormTextInput placeholder="Search... " className="border-[1px] p-2" />
            </div>
            <div className="px-2">
                {contacts && contacts.map((contact) => (
                        <Contact key={contact.contact.name} sender={contact.contact.name} count={contact.unreadMessagesCount} />
                    ))}
            </div>
        </div>
    )
}