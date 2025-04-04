import ChatTemplate from "./chat/ChatTemplate";
import { cookies } from "next/headers";
import { toshibaSatFont } from "@/app/styles/font";

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
      <main className={toshibaSatFont.className + ' flex-1 min-h-0'}>
        <div className="w-full h-full flex">
          <ChatTemplate userData={userData}  />
        </div>
      </main>
  );
}