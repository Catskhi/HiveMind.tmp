import { ReactNode } from "react";

interface Props {
    children?: ReactNode
}

export default function BackText({children}: Props) {
    return (
        <span className="text-[#565656]">
            {children ? children : "░"}
        </span>
    )
}