'use client'

import Link from 'next/link'
import { KeyRound, MessageCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const handleContactSupport = () => {
    const message = encodeURIComponent('Hi! I forgot my AgroBridge password and need help resetting it.')
    window.open(`https://wa.me/2348000000000?text=${message}`, '_blank')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <Link href="/" className="inline-block mb-8">
            <h1 className="text-3xl font-bold">
              <span className="text-gray-900">Agro</span>
              <span className="text-aj-yellow">Bridge</span>
            </h1>
          </Link>

          <div className="bg-gradient-to-r from-aj-yellow to-orange-400 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
            <KeyRound className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot your password?</h2>
          <p className="text-gray-600 mb-8">
            Self-service password reset isn't available yet. Message our support team on WhatsApp
            and we'll help you get back into your account.
          </p>

          <button
            onClick={handleContactSupport}
            className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 mb-4"
          >
            <MessageCircle className="w-5 h-5" /> Contact Support on WhatsApp
          </button>

          <Link href="/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-aj-yellow transition text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
