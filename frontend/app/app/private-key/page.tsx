'use client'

import { useApp } from "@/components/app/AppProvider";
import { useAuth } from "@/components/app/auth/AuthProvider";
import ContactsSidebar from "@/components/app/ContactsSidebar";
import BlockedButton from "@/components/BlockedButton"
import FormTextInput from "@/components/forms/FormTextInput";
import { verifyPrivateKey } from "@/utils/cryptoutils";
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function setupPrivateKeyPage() {
    const { isContactListHidden } = useApp()
    const { userData } = useAuth();
    const router = useRouter();
    const [privateKey, setPrivateKey] = useState(sessionStorage.getItem('privateKey'));
    const [userPrivateKeyInput, setUserPrivateKeyInput] = useState<string>("");
    const [verificationStatus, setVerificationStatus] = useState<string | null>(null)
    const [verificationError, setVerificationError] = useState<string | null>(null);

    const verifyInputPrivateKey = async () => {
        setVerificationStatus(null)
        setVerificationError(null)
        try {
            if (!userData?.publicKey) {
                setVerificationStatus("Public key not found in user data.")
                return;
            }
    
            const isValid = await verifyPrivateKey(
                userPrivateKeyInput,
                userData.publicKey
            );
    
            if (isValid) {
                setVerificationStatus("Key verified!");
                sessionStorage.setItem('privateKey', userPrivateKeyInput)
                setPrivateKey(userPrivateKeyInput)
                setUserPrivateKeyInput("");
            } else {
                setVerificationError("Invalid key pair")
            } 
        } catch (error) {
            console.log(error)
            setVerificationError("Verification failed");
        }
    }



    const handleCopyKey = () => {
        if (privateKey) {
            navigator.clipboard.writeText(privateKey)
                .then(() => console.log('Private key copied to clipboard!'))
                .catch(err => console.log('Failed to copy the key: ' + err));
        }
    }

    const handleDownloadKey = () => {
        if (privateKey) {
            const blob = new Blob([privateKey], { type: 'text/plain' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = 'hivemind_private_key.txt'
            link.click()
        }
    }

    return (
        <div className="flex-1 flex w-full min-h-0">
            <ContactsSidebar className={`min-h-0 lg:block ${isContactListHidden ? 'hidden' : 'block'}`} />
            <div className="w-full pt-4 px-10 overflow-x-auto flex flex-col">
                <h1 className="text-center text-xl">PRIVATE KEY</h1>
                {privateKey ? (
                    <div className="flex flex-col">
                        <p className="mb-4 text-center pt-4 text-lg">
                            This private key is essential for accessing your messages. 
                            Store it securely.
                            Hivemind <span className="text-red-600">cannot</span> recover it for you.
                        </p>
                        <div className="break-all bg-black/45 truncate px-5 py-2 mt-4 border lg:w-3/4 lg:self-center">
                            {privateKey}
                        </div>
                        <div className="mt-4 flex flex-col space-y-3 md:flex-row md:space-y-0 space-x-5 w-full justify-center text-lg">
                            <BlockedButton onClick={handleCopyKey}>Copy Key</BlockedButton>
                            <BlockedButton onClick={handleDownloadKey}>Download Key</BlockedButton>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <p className="mb-4 text-center pt-4 text-lg">
                            Private key not found, enter your private key to access your private messages.
                        </p>
                        <div className="flex space-x-2 justify-center">
                            {'>'} <FormTextInput className="lg:w-3/4 lg:self-center ml-2"
                                placeholder="Your hivemind private key here"
                                onChange={(e) => setUserPrivateKeyInput(e.target.value)}
                                value={userPrivateKeyInput}
                            />
                        </div>
                        <div className="mt-4 flex justify-center text-lg">
                            <BlockedButton onClick={verifyInputPrivateKey}>Verify Key</BlockedButton>
                        </div>
                        <p className="mt-4 text-center text-green-500">{verificationStatus}</p>
                        <p className="mt-4 text-center text-red-600">{verificationError}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
