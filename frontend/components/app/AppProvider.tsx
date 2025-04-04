'use client'

import { createContext, useContext, useState } from "react";

interface AppContextType {
    isContactListHidden: boolean
    setIsContactListHidden: (show: boolean) => void
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({children}: {children: React.ReactNode}) {
    const [isContactListHidden, setIsContactListHidden] = useState<boolean>(true);

    return (
        <AppContext.Provider
            value={{
                isContactListHidden,
                setIsContactListHidden
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within AppProvider");
    return context;
}