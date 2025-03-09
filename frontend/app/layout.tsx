import { Metadata} from "next";
import "./globals.css"
import { webplusFont } from "./styles/font";
import MatrixRain from "@/components/background/MatrixRain";

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
    <html className={webplusFont.className}>
      <head>
      </head>
      <body className="dark" suppressHydrationWarning={true}>
        <MatrixRain />
        {children}
      </body>
    </html>
  )
}