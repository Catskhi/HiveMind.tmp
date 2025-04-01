import { Metadata} from "next";
import "../globals.css"
import { toshibaSatFont } from "../styles/font";
import ChatHeader from "@/components/app/ui/ChatHeader";
import ContactsSidebar from "@/components/app/ContactsSidebar";
import AuthProvider from "@/components/app/auth/AuthProvider";
import { ChatProvider } from "@/components/app/chat/ChatProvider";

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
    <div className="flex flex-col h-screen bg-[rgb(0,0,0,0.45)]">
        <ChatHeader />
        <main className={toshibaSatFont.className + ' flex-1 min-h-0'}>
          <div className="w-full h-full flex">
            <div className="flex-1 flex w-full min-h-0">
              <AuthProvider>
                <ChatProvider>
                  <ContactsSidebar className="min-h-0" />
                  {children}
                </ChatProvider>
              </AuthProvider>
            </div>
          </div>
        </main>
    </div>
  )
}