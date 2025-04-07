"use client"

import BlockedButton from "@/components/BlockedButton";
import FormTextInput from "@/components/forms/FormTextInput";
import TextGlitchEffect from "@/components/style/TextGlitchEffect";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {

    const [name, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

        try {
            const response = await fetch(baseUrl + "/auth/register", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({ name, email, password })
            });
    
            const data = await response.json();
            if (!response.ok) {
                if (data.name) {
                    setErrorMessage(data.name);
                    return;
                }
                if (data.email) {
                    setErrorMessage(data.email);
                    return;
                }
                if (data.password) {
                    setErrorMessage(data.password);
                    return;
                }
                setErrorMessage(data.message || "Registration failed");
                return;
            }

            sessionStorage.setItem("privateKey", data.privateKey);
            router.push('/app/private-key');
        } catch (err) {
            console.error("Unexpected error:", err);
            setErrorMessage("Something went wrong. Please try again.");
        }
    };
    

    return (
        <div className="lg:mt-10 mt-5 flex justify-center text-xs md:text-sm lg:text-base px-5">
            <div className="m-auto flex flex-col xl:w-[55%] md:w-[70%] sm:w-[75%] w-[90%] px-5">
                <div>$ Register</div>
                <form onSubmit={handleSubmit}>
                    <div className="mt-5 md:flex">
                        <div className="md:mr-2 flex-shrink-0">{'>'} username@hivemind.tmp: </div>
                        <FormTextInput className="md:mt-0 mt-2" 
                        type="text"
                        placeholder="your_username"
                        onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="mt-3 md:flex">
                        <div className="md:mr-2 flex-shrink-0">{'>'} email@hivemind.tmp: </div>
                        <FormTextInput className="md:mt-0 mt-2" 
                        type="email"
                        placeholder="youremail@hivemind.tmp"
                        onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mt-3 md:flex">
                        <div className="md:mr-2 flex-shrink-0">{'>'} password@hivemind.tmp: </div>
                        <FormTextInput className="md:mt-0 mt-2 w-full" 
                        type="password"
                        placeholder="your passw0rd"
                        onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {errorMessage && (
                        <div className="mt-3">
                            [ <span className="text-red-500">FAIL</span> ]
                            <span className="text-red-500"> {errorMessage}</span>
                        </div>
                    )}
                    <BlockedButton type="submit" className="mt-5 w-full">
                        <TextGlitchEffect text="CONNECT TO HIVE" />
                    </BlockedButton>
                </form>
                <Link href="/">
                    <BlockedButton className="mt-5 w-full">
                        <TextGlitchEffect text="BACK" duration={70} interval={25} />
                    </BlockedButton>
                </Link>
            </div>
        </div>
    )
}