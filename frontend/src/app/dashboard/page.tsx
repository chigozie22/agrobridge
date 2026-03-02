'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, TrendingDown, MapPin, Calendar, Package, LogOut, User, Settings } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Use environment variable for API URL (works locally and on Vercel)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    // Check if user is logged in
    const accessToken = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('user')
    
    if (!accessToken || !userData) {
      window.location.href = '/login'
      return
    }

    // Set user data from localStorage first (for immediate display)
    setUser(JSON.parse(userData))
    setLoading(false)

    // Optional: Fetch fresh user data from API
    // This ensures we have the latest data from backend
    fetchUserProfile(accessToken)
  }, [])

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/profile/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(data))
      } else if (response.status === 401) {
        // Token expired or invalid
        handleLogout()
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
      // Continue with localStorage data if API call fails
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aj-yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold">
                <span className="text-gray-900">Agro</span>
                <span className="text-aj-yellow">Bridge</span>
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/products" className="text-gray-700 hover:text-aj-yellow transition">
                Browse Products
              </Link>
              <Link href="/dashboard" className="text-aj-yellow font-semibold">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-aj-yellow to-orange-400 rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-aj-dark mb-2">
                Welcome back, {user?.name}! 👋
              </h2>
              <p className="text-gray-800">
                Ready to save more on your food purchases?
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white rounded-full p-4">
                <User className="w-12 h-12 text-aj-yellow" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">This month</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">0</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>

          {/* Money Saved */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <TrendingDown className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">₦0</p>
            <p className="text-sm text-gray-600">Money Saved</p>
          </div>

          {/* Active Cluster */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 rounded-full p-3">
                <MapPin className="w-6 h-6 text-aj-yellow" />
              </div>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1">
              {user?.cluster?.name || 'No cluster'}
            </p>
            <p className="text-sm text-gray-600">Your Cluster</p>
          </div>

          {/* Member Since */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-full p-3">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1">
              {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
            </p>
            <p className="text-sm text-gray-600">Member Since</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
              <Link href="/orders" className="text-sm text-aj-yellow hover:underline font-semibold">
                View All
              </Link>
            </div>

            {/* Empty State */}
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No orders yet</p>
              <p className="text-sm text-gray-500 mb-6">Start shopping to see your orders here</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-aj-yellow text-aj-dark px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                Browse Products
                <ShoppingBag className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/products"
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-aj-yellow to-orange-400 text-aj-dark rounded-lg hover:from-yellow-400 hover:to-orange-500 transition"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="font-semibold">Browse Products</span>
              </Link>
              <Link
                href="/orders"
                className="flex items-center gap-3 p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <Package className="w-5 h-5 text-gray-700" />
                <span className="font-semibold text-gray-700">My Orders</span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <Settings className="w-5 h-5 text-gray-700" />
                <span className="font-semibold text-gray-700">Edit Profile</span>
              </Link>
            </div>

            {/* User Info Card */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Account Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-semibold text-gray-900">{user?.phone}</span>
                </div>
                {user?.email && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold text-gray-900">{user?.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-semibold text-gray-900 capitalize">{user?.role?.toLowerCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-8 bg-gradient-to-br from-aj-green to-green-700 rounded-2xl p-8 text-white">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-bold mb-3">🎉 Refer Friends, Earn Rewards!</h3>
            <p className="mb-6 text-green-100">
              Invite your friends to join AgroBridge and get ₦500 credit for each successful referral.
            </p>
            <button className="bg-white text-aj-green px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
              Get Your Referral Link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}