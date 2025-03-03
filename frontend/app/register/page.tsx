"use client"

import BlockedButton from "@/components/BlockedButton";
import FormTextInput from "@/components/forms/FormTextInput";
import TextGlitchEffect from "@/components/style/TextGlitchEffect";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export default function Register() {

    const [name, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage("")
        try {
            const response = await axios.post('http://localhost:8080/auth/register', {name, email, password})
            sessionStorage.setItem("token", response.data.token)
            console.log(response)
        } catch (error) {
            if (error.response.data.name) {
                setErrorMessage(error.response.data.name)
                return
            }
            if (error.response.data.email) {
                setErrorMessage(error.response.data.email)
                return
            }
            if (error.response.data.password) {
                setErrorMessage(error.response.data.password)
                return
            }
            setErrorMessage(error.response.data.message)
        }
    }

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