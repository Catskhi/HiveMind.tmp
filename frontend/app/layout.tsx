export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}