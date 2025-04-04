'use client'

import TextGlitchEffect from "@/components/style/TextGlitchEffect"
import TextButton from "@/components/ui/TextButton"
import Link from "next/link"
import { useChat } from "../chat/ChatProvider"

interface Props {
    onClick?: () => void
}

export default function HeaderGlobalChatButton({onClick}: Props) {
    const { changeChat } = useChat()
    
    return (
        <Link href={'/app'} onClick={onClick}>
            <TextButton onClick={() => changeChat(true)}>
                <span className="hidden md:block">
                    [ <TextGlitchEffect text="Global Chat" duration={75} interval={45} /> ]
                </span>
                <span className="block md:hidden">
                    {'>'} <TextGlitchEffect  text="Global Chat" duration={75} interval={45} />
                </span>
            </TextButton>
        </Link>
    )
}