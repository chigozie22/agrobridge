'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle, MapPin, ArrowRight } from 'lucide-react'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    cluster: '',
  })
  
  const [clusters, setClusters] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Use environment variable for API URL (works locally and on Vercel)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    fetch(`${API_URL}/api/clusters/`)
      .then(res => res.json())
      .then(data => setClusters(data.results || data))
      .catch(err => console.error('Error fetching clusters:', err))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
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
          password: formData.password,
          password_confirm: formData.confirmPassword,
          cluster: formData.cluster || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('accessToken', data.tokens.access)
        localStorage.setItem('refreshToken', data.tokens.refresh)
        localStorage.setItem('user', JSON.stringify(data.user))
        window.location.href = '/dashboard'
      } else {
        setError(data.error || 'Registration failed. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = () => {
    const password = formData.password
    if (password.length === 0) return { strength: 0, label: '', color: '' }
    if (password.length < 6) return { strength: 25, label: 'Weak', color: 'bg-red-500' }
    if (password.length < 8) return { strength: 50, label: 'Fair', color: 'bg-yellow-500' }
    if (password.length < 12) return { strength: 75, label: 'Good', color: 'bg-blue-500' }
    return { strength: 100, label: 'Strong', color: 'bg-green-500' }
  }

  const strength = passwordStrength()

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-block mb-8">
            <h1 className="text-3xl font-bold">
              <span className="text-gray-900">Agro</span>
              <span className="text-aj-yellow">Bridge</span>
            </h1>
          </Link>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600 mb-8">Join thousands saving on food purchases</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aj-yellow focus:border-transparent transition text-gray-900"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Optional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aj-yellow focus:border-transparent transition text-gray-900"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Your Cluster</label>
              <div className="relative">
                <select
                  name="cluster"
                  value={formData.cluster}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aj-yellow focus:border-transparent transition appearance-none text-gray-900"
                >
                  <option value="">Choose a cluster near you</option>
                  {clusters.map((cluster: any) => (
                    <option key={cluster.id} value={cluster.id}>{cluster.name}</option>
                  ))}
                </select>
                <MapPin className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aj-yellow focus:border-transparent transition pr-12 text-gray-900"
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password strength</span>
                    <span className="text-xs font-semibold text-gray-700">{strength.label}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${strength.color}`}
                      style={{ width: `${strength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aj-yellow focus:border-transparent transition pr-12 text-gray-900"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-aj-yellow to-orange-400 text-aj-dark font-bold py-3 px-6 rounded-lg hover:from-yellow-400 hover:to-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-aj-yellow font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="max-w-lg">
          <div className="mb-12 relative">
            <div className="bg-gradient-to-br from-aj-yellow to-orange-300 rounded-3xl p-8 shadow-2xl">
              <div className="text-center">
                <div className="text-9xl mb-4">📦</div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-5xl">😊</div>
                  <div className="text-5xl">🚚</div>
                  <div className="text-5xl">✅</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 rounded-full p-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Stress-Free</p>
                  <p className="text-xs text-gray-600">Delivery</p>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            We Handle All Your <span className="text-aj-yellow">Food Needs</span>
          </h3>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            From households to events, NGOs to restaurants, humanitarian missions to individual orders—we aggregate the best prices, source from verified vendors, and deliver with excellence.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-white rounded-full p-2 shadow-md">
                <CheckCircle className="w-5 h-5 text-aj-green" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Better Prices</p>
                <p className="text-sm text-gray-600">Save up to 15% on every order</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white rounded-full p-2 shadow-md">
                <CheckCircle className="w-5 h-5 text-aj-green" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Verified Vendors</p>
                <p className="text-sm text-gray-600">Quality guaranteed on every item</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white rounded-full p-2 shadow-md">
                <CheckCircle className="w-5 h-5 text-aj-green" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Reliable Delivery</p>
                <p className="text-sm text-gray-600">On-time, every time</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white rounded-full p-2 shadow-md">
                <CheckCircle className="w-5 h-5 text-aj-green" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">For Everyone</p>
                <p className="text-sm text-gray-600">Households, events, NGOs, restaurants</p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-white rounded-xl p-6 shadow-lg">
            <p className="text-sm text-gray-600 mb-2">Powered by</p>
            <p className="text-2xl font-bold text-aj-yellow">AJ-Fresh Farmfoods</p>
            <p className="text-xs text-gray-500 mt-1">Government Registered & Verified</p>
          </div>
        </div>
      </div>
    </div>
  )
}