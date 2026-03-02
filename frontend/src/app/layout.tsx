import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AgroBridge - Smart Food Buying Through Aggregation',
  description: 'AgroBridge helps you buy food at lower prices by combining orders, matching items to the cheapest sellers, and delivering everything together.',
  keywords: 'food delivery, bulk buying, group buying, Nigeria food, cheap food prices, AJ-Fresh Farmfoods',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
