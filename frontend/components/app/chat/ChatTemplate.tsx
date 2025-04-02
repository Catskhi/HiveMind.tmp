'use client'

import { useApp } from "../AppProvider"
import { UserData } from "../auth/AuthProvider"
import ContactsSidebar from "../ContactsSidebar"
import ChatInput from "./ChatInput"
import { ChatMessages } from "./ChatMessages"

interface Props {
    userData: UserData
}

export default function ChatTemplate({userData}: Props) {
    const { isContactListHidden } = useApp()
    return (
    <div className="flex-1 flex w-full min-h-0">
        <ContactsSidebar className={`min-h-0 lg:block ${isContactListHidden ? 'hidden' : 'block'}`} />
        <div className="flex flex-col flex-1 h-full">
            <div className="flex flex-col h-screen overflow-hidden">
                <ChatMessages />
                <div className="sticky bottom-0 bg-black/45 border-t">
                    <ChatInput username={userData.name} />
                </div>
            </div>
        </div>
    </div>
    )
}