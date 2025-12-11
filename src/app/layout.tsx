import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'All In One Studio',
  description: 'All In One Studio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50">
        {children}
        <Toaster />
      </body>
    </html>
  )
}