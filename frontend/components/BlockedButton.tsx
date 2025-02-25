import { ReactNode } from "react"

interface Props {
    children?: ReactNode
    title?: string
    className?: string
}

export default function BlockedButton({children, title, className}: Props) {
    return (
        <button title={title} className={className + ' hover:text-[#C0C0C0] cursor-pointer '}>
          {'█▓▒░'} {children} {'░▒▓█'}
        </button>
    )
}