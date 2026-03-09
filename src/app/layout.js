import "./globals.scss"

export const metadata = {
  title: "Believe Fitness",
  description: "Train like a pro",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
