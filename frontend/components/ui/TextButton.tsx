import { ReactNode } from "react"

interface Props {
    children?: ReactNode
    title?: string
    className?: string
    type?: "submit"
    disabled?: boolean
    onClick?: () => void
}

export default function TextButton({children, title, className, type, onClick, disabled}: Props) {
    return (
        <button title={title} className={className + ' hover:text-[#C0C0C0] disabled:text-[#707070] cursor-pointer '}
            type={type}
            onClick={onClick}
            disabled={disabled}
        >
          {children}
        </button>
    )
}