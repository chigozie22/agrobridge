'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, LogIn } from 'lucide-react'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    rememberMe: false,
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Use environment variable for API URL (works locally and on Vercel)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('accessToken', data.tokens.access)
        localStorage.setItem('refreshToken', data.tokens.refresh)
        localStorage.setItem('user', JSON.stringify(data.user))
        window.location.href = '/dashboard'
      } else {
        setError(data.error || 'Invalid phone number or password')
      }
    } catch (err) {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <Link href="/" className="inline-block mb-8">
            <h1 className="text-3xl font-bold">
              <span className="text-gray-900">Agro</span>
              <span className="text-aj-yellow">Bridge</span>
            </h1>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-aj-yellow to-orange-400 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aj-yellow focus:border-transparent transition text-gray-900"
                placeholder="08012345678"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aj-yellow focus:border-transparent transition pr-12 text-gray-900"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-aj-yellow border-gray-300 rounded focus:ring-aj-yellow"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-aj-yellow hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-aj-yellow to-orange-400 text-aj-dark font-bold py-3 px-6 rounded-lg hover:from-yellow-400 hover:to-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-aj-yellow font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Secured by <span className="font-semibold text-aj-yellow">AJ-Fresh Farmfoods</span>
          </p>
        </div>
      </div>
    </div>
  )
}