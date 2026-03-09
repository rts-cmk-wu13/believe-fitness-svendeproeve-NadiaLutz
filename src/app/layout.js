import "./globals.scss"
import { NavProvider } from "@/components/nav/NavContext"
import Nav from "@/components/nav/Nav"

export const metadata = {
  title: "Believe Fitness",
  description: "Train like a pro",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavProvider>
          <Nav />
          {children}
        </NavProvider>
      </body>
    </html>
  )
}
