'use client'
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
    userData: UserData | null
}

interface UserData {
    id: number
    name: string
    email: string
    publicKey: string
    privateKey: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const baseBackendUrl: string = process.env.NEXT_PUBLIC_BACKEND_BASE_URL as string
    const [userData, setUserData] = useState<UserData | null>(null)

    const fetchUserData = async () => {
        try {
            const response = await fetch(baseBackendUrl + "/user", {
                credentials: 'include'
            })
            const data = await response.json()
            setUserData(data)
        } catch (error) {
            throw new Error("Failed to load user.")
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [])


    return (
        <AuthContext.Provider value={{userData}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within a AuthProvider");
    return context
}