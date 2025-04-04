'use client'
import { useChat } from "@/components/app/chat/ChatProvider";
import FormTextInput from "@/components/forms/FormTextInput";
import TextButton from "@/components/ui/TextButton";
import { useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { useRouter } from 'next/navigation'
import ContactsSidebar from "../../ContactsSidebar";
import { useApp } from "../../AppProvider";

interface foundUserType {
    username: string
    publicKey: string
}

export default function FindPageLayout() {
    const { isContactListHidden } = useApp()
    const { userData } = useAuth()
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
    const router = useRouter()
    const { changeChat } = useChat()
    const [username, setUsername] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [foundUser, setFoundUser] = useState<foundUserType | null>(null)
    const [searchingForUser, setSearchingForUser] = useState<boolean>(false)

    const searchForUser = async () => {
        try {
            setFoundUser(null)
            setError('')
            setSearchingForUser(true)
            if (username == userData?.name) throw new Error("You can't message yourself");
            const response = await fetch(baseUrl + '/user/' + username, {
                credentials: 'include'
            });
    
            const data = await response.json();
            if (response.status === 404) {
                throw new Error("You must type a valid user name")
            }
            if (!response.ok) {
                throw new Error(data.message);
            }
            setFoundUser({
                username: data.name,
                publicKey: data.publicKey
            })
        } catch (error) {
            console.log(error)
            if (error.message) {
                console.log("An error occurred on message: " + error.message);
                setError(error.message)
            }
        }
        setSearchingForUser(false)
    };

    const startChatWithUser = () => {
        if (username.length > 1 && userData?.name != username && foundUser) {
            changeChat(false, {name: foundUser.username, publicKey: foundUser.publicKey})
            router.push('/app')
        }
    }

    return (
        <div className="flex-1 flex w-full min-h-0">
        <ContactsSidebar className={`min-h-0 lg:block ${isContactListHidden ? 'hidden' : 'block'}`} />
        <div className="p-4 w-full">
            <div className="flex flex-col min-w-0 w-full space-y-3 ">
                <h1 className="text-lg">Find Page</h1>
                <div>
                    Type the username below
                </div>
                <div className="flex space-x-3">
                    <span>{'>'}</span>
                    <FormTextInput 
                    className="w-full" 
                    value={username}
                    type="text"
                    placeholder="Username example"
                    maxLength={100}
                    onChange={e => setUsername(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && username.length > 0) {
                            searchForUser()
                        }
                    }}
                    />
                    <TextButton onClick={searchForUser} disabled={username.length < 1}>Search</TextButton>
                </div>
                <div className="text-[#D40000]">
                    { error }
                </div>
                {foundUser && (
                    <div className="border-2 p-4 rounded-lg bg-black">
                        <div className="text-xl font-bold">User Found</div>
                        <div className="mt-2">
                            <p className="">Username: <span className="text-green-500">{foundUser.username}</span></p>
                            <p className="">
                                Public Key: <span className="text-green-500 max-w-full break-all overflow-x-auto">
                                    {foundUser.publicKey}
                                </span>
                            </p>
                        </div>
                        <div className="my-4">
                            <p className="">Status: <span className="text-green-500">Connected</span></p>
                        </div>
                        <div>
                            <TextButton
                                onClick={startChatWithUser}
                            >
                                [ Send Message ]
                            </TextButton>
                        </div>
                    </div>
                )}
                {searchingForUser && (
                    <div className="rounded-md">
                        <p className="text-green-300">Searching for user...</p>
                    </div>
                )}
            </div>
        </div>
        </div>
    )
}