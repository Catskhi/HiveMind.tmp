import { Metadata} from "next";
import "./globals.css"
import { webplusFont } from "./styles/font";
import Title from "@/components/title";
import MatrixRain from "@/components/background/MatrixRain";

export const metadata: Metadata = {
  title:"Hivemind",
  description: "Secure communication"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={webplusFont.className}>
      <head>
        <link rel="icon" href="../public/images/bee-pixel-sprite.svg" sizes="any" type="image/svg+xml" />
      </head>
      <body className="dark" suppressHydrationWarning={true}>
        <header>
          <div className='flex justify-center mt-5 items-center'><br/>
            <Title/>
            <div></div>
          </div>
        </header>
        <main>
          {children}
          <MatrixRain />
        </main>
      </body>
    </html>
  )
}