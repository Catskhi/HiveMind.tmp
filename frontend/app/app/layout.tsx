import { Metadata} from "next";
import "../globals.css"
import ChatHeader from "@/components/app/ui/ChatHeader";
import AuthProvider from "@/components/app/auth/AuthProvider";
import { ChatProvider } from "@/components/app/chat/ChatProvider";
import { AppProvider} from "@/components/app/AppProvider";
import { toshibaSatFont } from "../styles/font";

export const metadata: Metadata = {
  title:"Hivemind",
  description: "Secure communication",
  icons: "/images/bee-pixel-sprite.svg"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (

    <AppProvider>
      <div className={toshibaSatFont.className +  " flex flex-col h-screen bg-[rgb(0,0,0,0.45)]"}>
        <AuthProvider>
          <ChatProvider>
            <ChatHeader />
            {children}
          </ChatProvider>
        </AuthProvider>
      </div>
    </AppProvider>
  )
}