import { ReactNode } from "react";

interface Props {
    children: ReactNode
}

export default function WhiteText({children}: Props) {
    return (
        <span className="text-white">
            {children}
        </span>
    )
}