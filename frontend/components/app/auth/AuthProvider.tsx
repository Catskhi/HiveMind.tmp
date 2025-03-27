'use client'
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
    userData: UserData | null
    isLoading: boolean  // New loading state
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
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const router = useRouter()

    const fetchUserData = async () => {
        try {
            const response = await fetch(baseBackendUrl + "/user", {
                credentials: 'include'
            })
            if (!response.ok) {
                throw new Error(`Authentication failed with status: ${response.status}`)
            }
            const data = await response.json()
            setUserData(data)
        } catch (error) {
            console.error("Failed to load user:", error)
            router.replace('/login')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <AuthContext.Provider value={{userData, isLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within a AuthProvider");
    return context
}