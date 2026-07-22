import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import ChatWidget from '@/components/ChatWidget'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AgroBridge - Smart Food Buying Through Aggregation',
  description: 'AgroBridge helps you buy food at lower prices by combining orders, matching items to the cheapest sellers, and delivering everything together.',
  keywords: 'food delivery, bulk buying, group buying, Nigeria food, cheap food prices, AJ-Fresh Farmfoods',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <CartProvider>
            {children}
            <ChatWidget />
          </CartProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
