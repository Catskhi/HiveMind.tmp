'use client'

import { useAuth } from "../auth/AuthProvider";

export default function HeaderUserInfo() {
    const { userData } = useAuth()

    return (
        <div className="text-sm">
            <span className="text-lime-300">{userData?.name}</span>@hivemind.tmp
        </div>
    )
}