"use client"
import BlockedButton from "@/components/BlockedButton";
import FormTextInput from "@/components/forms/FormTextInput";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage("")
        try {
            const response = await axios.post("http://localhost:8080/auth/login", {
                email,
                password
            })
            sessionStorage.setItem("token", response.data.token)
            console.log(response)
        } catch (error) {
            if (error.response.data.email) {
                setErrorMessage(error.response.data.email)
            }
            if (error.response.data.password) {
                setErrorMessage(error.response.data.password)
            }
            setErrorMessage(error.response.data.message)
        }
    }

    return (
        <div className="lg:mt-10 mt-5 flex justify-center text-xs lg:text-base px-5">
            <div className="m-auto flex flex-col xl:w-[55%] md:w-[70%] sm:w-[75%] w-[90%] px-5">
                <div>$ Login</div>
                <form onSubmit={handleSubmit}>
                    <div className="mt-5 md:flex">
                        <div className="md:mr-2 flex-shrink-0">{'>'} email@hivemind.tmp: </div>
                        <FormTextInput className="md:mt-0 mt-2" 
                        type="email"
                        placeholder="youremail@hivemind.tmp"
                        onChange={(e) => setEmail(e.target.value)}
                        />
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
                    <div className="w-full flex items-center justify-center">
                        <BlockedButton type="submit" className="mt-5">CONNECT TO HIVE</BlockedButton>
                    </div>
                </form>
                <Link href="/" className="self-center">
                    <BlockedButton className="mt-5">BACK</BlockedButton>
                </Link>
                <div>
                    
                </div>
            </div>
        </div>
    )
}