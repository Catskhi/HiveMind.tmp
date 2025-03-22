import { Metadata} from "next";
import "../globals.css"
import { ibmEgaFont, toshibaSatFont } from "../styles/font";

export const metadata: Metadata = {
  title:"Hivemind",
  description: "Secure communication",
  icons: "/images/bee-pixel-sprite.svg"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
        <main className={toshibaSatFont.className}>
            {children}
        </main>
    </>
  )
}