import { ReactNode } from "react"

interface Props {
    children?: ReactNode
    title?: string
    className?: string
    type?: "submit"
    onClick?: () => void
}

export default function BlockedButton({children, title, className, type, onClick}: Props) {
    return (
        <button title={title} className={className + ' hover:text-[#C0C0C0] cursor-pointer '}
            type={type} onClick={onClick}
        >
          {'█▓▒░'} {children} {'░▒▓█'}
        </button>
    )
}