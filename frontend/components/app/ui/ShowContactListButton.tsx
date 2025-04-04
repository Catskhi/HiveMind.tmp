'use client'

import { useApp } from "../AppProvider"

interface Props {
    className?: string
}

export default function ShowContactListButton({ className }: Props) {
    const { isContactListHidden, setIsContactListHidden } = useApp()

    const toggleContactListHidden = () => {
        setIsContactListHidden(!isContactListHidden);
    }

    return (
        <button onClick={toggleContactListHidden}
        className={className + ' lg:hidden text-[28px] hover:text-[#C0C0C0] disabled:text-[#707070] cursor-pointer'}>
            { isContactListHidden ? '»' : '«' }
        </button>
    )
}