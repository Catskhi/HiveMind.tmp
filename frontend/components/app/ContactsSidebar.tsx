"use client";

import { useEffect } from "react";
import FormTextInput from "../forms/FormTextInput";
import { useChat } from "./chat/ChatProvider";
import Contact from "./Contact";
import Link from "next/link";
import TextGlitchEffect from "../style/TextGlitchEffect";
import TextButton from "../ui/TextButton";
import HeaderGlobalChatButton from "./ui/HeaderGlobalChatButton";
import { useApp } from "./AppProvider";

interface Props {
    className?: string
}

export default function ContactsSidebar({className}: Props)  {
    const { setIsContactListHidden } = useApp()
    const { contacts, fetchContacts } = useChat()

    useEffect(() => {
        fetchContacts()
    }, [])

    const hideSideBar = () => {
        setIsContactListHidden(true)
    }
    
    return (
        <div className={className + ' w-64 border-[#9b9b9b] absolute bg-black z-20 h-full md:static md:z-0 md:h-auto md:bg-black/45'}>
            <div className="flex flex-col px-2 mt-4 md:hidden">
                <Link href={'/app/find'} onClick={hideSideBar}>
                    <TextButton>
                        {'>'} <TextGlitchEffect text="Find People" duration={75} interval={30} />
                    </TextButton>
                </Link>
                <HeaderGlobalChatButton onClick={hideSideBar} />
                <Link href={'/app/private-key'} onClick={hideSideBar}>
                    <TextButton>
                        {'>'} <TextGlitchEffect text="Private Key" duration={75} interval={30} />
                    </TextButton>
                </Link>
            </div>
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