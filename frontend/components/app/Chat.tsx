import ChatInput from "./chat/ChatInput";
import { ChatMessages } from "./chat/ChatMessages";
import ChatTemplate from "./chat/ChatTemplate";
import { cookies } from "next/headers";

export default async function ChatPage() {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
    const cookieHeader = (await cookies()).toString();

    const userData = await fetch(`${baseUrl}/user`, {
      headers: {
        Cookie: cookieHeader
      },
      cache: 'no-store'
    }).then(res => res.json());
  
    return (
      <ChatTemplate>
          <div className="flex flex-col h-screen overflow-hidden">
              <ChatMessages />
              <div className="sticky bottom-0 bg-background border-t">
                  <ChatInput username={userData.name} />
              </div>
          </div>
      </ChatTemplate>
  );
  }