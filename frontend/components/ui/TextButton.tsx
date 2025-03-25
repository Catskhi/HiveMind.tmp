import { ReactNode } from "react"

interface Props {
    children?: ReactNode
    title?: string
    className?: string
    type?: "submit"
}

export default function TextButton({children, title, className, type}: Props) {
    return (
        <button title={title} className={className + ' hover:text-[#C0C0C0] cursor-pointer '}
            type={type}
        >
          {children}
        </button>
    )
}