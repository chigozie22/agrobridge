'use client'

import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

export interface NavLink {
  href: string
  label: string
  active?: boolean
}

interface NavbarProps {
  links: NavLink[]
  rightSlot?: ReactNode
}

export default function Navbar({ links, rightSlot }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="sm:hidden -ml-1 p-1.5 text-gray-700 hover:text-aj-yellow"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/" className="text-2xl font-bold">
                <span className="text-gray-900">Agro</span><span className="text-aj-yellow">Bridge</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    link.active
                      ? 'text-aj-yellow font-semibold text-sm'
                      : 'text-gray-700 hover:text-aj-yellow transition hidden sm:block text-sm font-medium'
                  }
                >
                  {link.label}
                </Link>
              ))}
              {rightSlot}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile nav drawer — slides in from the left */}
      <div
        className={`fixed inset-0 z-[60] sm:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute left-0 top-0 h-full w-72 max-w-[80%] bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <span className="text-xl font-bold">
              <span className="text-gray-900">Agro</span><span className="text-aj-yellow">Bridge</span>
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-gray-500 hover:text-gray-700 p-1"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={
                  link.active
                    ? 'block px-5 py-3 text-aj-yellow font-bold bg-yellow-50 border-l-4 border-aj-yellow'
                    : 'block px-5 py-3 text-gray-700 font-medium hover:bg-gray-50 hover:text-aj-yellow transition'
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
