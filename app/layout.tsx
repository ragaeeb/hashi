import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Hashi",
  description: "Guide a brave duck family through vibrant city adventures.",
}

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}

export default RootLayout
