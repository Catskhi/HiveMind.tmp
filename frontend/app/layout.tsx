import { Metadata} from "next";
import localFont from 'next/font/local';
import "./globals.css"

export const metadata: Metadata = {
  title:"Hivemind",
  description: "Secure communication"
}

const webplusFont = localFont({
  src: '../public/fonts/Ac437_ToshibaSat_8x14.ttf'
})

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
        {children}
      </body>
    </html>
  )
}