'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, UserPlus } from 'lucide-react'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    cluster: '',
    password: '',
    confirmPassword: '',
  })
  
  const [clusters, setClusters] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<any>({})

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    fetchClusters()
  }, [])

  const fetchClusters = async () => {
    try {
      const response = await fetch(`${API_URL}/api/clusters/`)
      const data = await response.json()
      console.log('Fetched clusters:', data)
      setClusters(data.results || data)
    } catch (err) {
      console.error('Failed to fetch clusters:', err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear field error when user types
    if (fieldErrors[e.target.name]) {
      setFieldErrors({
        ...fieldErrors,
        [e.target.name]: ''
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          cluster: formData.cluster,
          password: formData.password,
          role: 'BUYER',
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Success
        localStorage.setItem('accessToken', data.tokens.access)
        localStorage.setItem('refreshToken', data.tokens.refresh)
        localStorage.setItem('user', JSON.stringify(data.user))
        window.location.href = '/dashboard'
      } else {
        // Handle specific field errors
        if (typeof data === 'object') {
          const errors: any = {}
          let hasFieldErrors = false
          
          if (data.phone) {
            errors.phone = Array.isArray(data.phone) ? data.phone[0] : data.phone
            hasFieldErrors = true
          }
          if (data.email) {
            errors.email = Array.isArray(data.email) ? data.email[0] : data.email
            hasFieldErrors = true
          }
          if (data.password) {
            errors.password = Array.isArray(data.password) ? data.password[0] : data.password
            hasFieldErrors = true
          }
          if (data.name) {
            errors.name = Array.isArray(data.name) ? data.name[0] : data.name
            hasFieldErrors = true
          }
          if (data.cluster) {
            errors.cluster = Array.isArray(data.cluster) ? data.cluster[0] : data.cluster
            hasFieldErrors = true
          }
          
          if (hasFieldErrors) {
            console.log('Setting errors:', errors) 
            setFieldErrors(errors)
            setError('Please fix the errors below')
          } else {
            setError(data.error || data.detail || 'Registration failed. Please check your information.')
          }
        } else {
          setError('Registration failed. Please try again.')
        }
      }
    } catch (err) {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
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
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join your community and start saving on food</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-aj-yellow focus:border-transparent transition text-gray-900 ${
                  fieldErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {fieldErrors.name && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.name}</p>
              )}
            </div>

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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-aj-yellow focus:border-transparent transition text-gray-900 ${
                  fieldErrors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="08012345678"
              />
              {fieldErrors.phone && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-aj-yellow focus:border-transparent transition text-gray-900 ${
                  fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
              />
              {fieldErrors.email && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Cluster */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Cluster
              </label>
              <select
                name="cluster"
                value={formData.cluster}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-aj-yellow focus:border-transparent transition text-gray-900 ${
                  fieldErrors.cluster ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select your area</option>
                {clusters.map((cluster: any) => (
                  <option key={cluster.id} value={cluster.id}>
                    {cluster.name} - {cluster.location}
                  </option>
                ))}
              </select>
              {fieldErrors.cluster && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.cluster}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Choose the cluster nearest to you</p>
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-aj-yellow focus:border-transparent transition pr-12 text-gray-900 ${
                    fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aj-yellow focus:border-transparent transition text-gray-900"
                placeholder="Re-enter your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-aj-yellow to-orange-400 text-aj-dark font-bold py-3 px-6 rounded-lg hover:from-yellow-400 hover:to-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-aj-yellow font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-aj-yellow via-orange-400 to-orange-500 p-12 items-center justify-center">
        <div className="max-w-md text-white">
          <h2 className="text-4xl font-bold mb-6">Save More Together</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 rounded-full p-3 mt-1">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Save 20-30%</h3>
                <p className="text-white/90">Group buying power means better prices for everyone</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-white/20 rounded-full p-3 mt-1">
                <span className="text-2xl">🥬</span>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Fresh Products</h3>
                <p className="text-white/90">Direct from verified farmers and vendors</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-white/20 rounded-full p-3 mt-1">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Local Community</h3>
                <p className="text-white/90">Connect with neighbors in your area</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}