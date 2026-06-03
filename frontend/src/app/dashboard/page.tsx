'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, TrendingDown, MapPin, Calendar, Package, LogOut, User, Settings, ChevronRight, Clock, CheckCircle, Truck, XCircle, AlertCircle } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  PENDING:     { label: 'Pending',    color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  AGGREGATING: { label: 'Aggregating',color: 'bg-blue-100 text-blue-700',    icon: Package },
  CONFIRMED:   { label: 'Confirmed',  color: 'bg-green-100 text-green-700',  icon: CheckCircle },
  PROCESSING:  { label: 'Processing', color: 'bg-purple-100 text-purple-700',icon: Package },
  READY:       { label: 'Ready',      color: 'bg-indigo-100 text-indigo-700',icon: CheckCircle },
  IN_TRANSIT:  { label: 'On the Way', color: 'bg-orange-100 text-orange-700',icon: Truck },
  DELIVERED:   { label: 'Delivered',  color: 'bg-green-100 text-green-800',  icon: CheckCircle },
  CANCELLED:   { label: 'Cancelled',  color: 'bg-red-100 text-red-700',      icon: XCircle },
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [nextDelivery, setNextDelivery] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('user')
    if (!token || !userData) { window.location.href = '/login'; return }

    setUser(JSON.parse(userData))
    setLoading(false)

    fetchUserProfile(token)
    fetchOrders(token)
    fetchNextDelivery(token)
  }, [])

  const fetchUserProfile = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/profile/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
      } else if (res.status === 401) {
        handleLogout()
      }
    } catch {}
  }

  const fetchNextDelivery = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/deliveries/upcoming/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        if (data.scheduled_date) setNextDelivery(data)
      }
    } catch {}
  }

  const fetchOrders = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setOrders(Array.isArray(data) ? data : data.results || [])
      }
    } catch {}
    finally { setOrdersLoading(false) }
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  // Computed stats
  const totalOrders = orders.length
  const totalSpent = orders
    .filter(o => o.payment_status === 'SUCCESS')
    .reduce((sum, o) => sum + Number(o.total_amount), 0)
  const estimatedSavings = Math.round(totalSpent * 0.22)
  const activeOrder = orders.find(o => !['DELIVERED', 'CANCELLED'].includes(o.status))
  const recentOrders = orders.slice(0, 4)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aj-yellow" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-gray-900">Agro</span><span className="text-aj-yellow">Bridge</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/products" className="text-gray-700 hover:text-aj-yellow transition hidden sm:block">Browse Products</Link>
              <Link href="/orders" className="text-gray-700 hover:text-aj-yellow transition hidden sm:block">My Orders</Link>
              <Link href="/dashboard" className="text-aj-yellow font-semibold">Dashboard</Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold text-sm">
                <LogOut className="w-4 h-4" /> Logout
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
              <h2 className="text-3xl font-bold text-aj-dark mb-1">Welcome back, {user?.name}! 👋</h2>
              <p className="text-gray-800 text-sm">
                {activeOrder
                  ? `You have an active order — ${STATUS_CONFIG[activeOrder.status]?.label}`
                  : 'Ready to save more on your food purchases?'}
              </p>
              {activeOrder && (
                <Link href={`/orders/${activeOrder.id}`}
                  className="inline-block mt-3 bg-aj-dark text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
                >
                  Track Order #{activeOrder.id} →
                </Link>
              )}
            </div>
            <div className="hidden md:block bg-white rounded-full p-4">
              <User className="w-12 h-12 text-aj-yellow" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">All time</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{ordersLoading ? '—' : totalOrders}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <TrendingDown className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-gray-500">~22% savings</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {ordersLoading ? '—' : `₦${estimatedSavings.toLocaleString()}`}
            </p>
            <p className="text-sm text-gray-600">Estimated Savings</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 rounded-full p-3">
                <MapPin className="w-6 h-6 text-aj-yellow" />
              </div>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1 truncate">
              {user?.cluster?.name || 'No cluster yet'}
            </p>
            <p className="text-sm text-gray-600">Your Cluster</p>
            {nextDelivery && (
              <p className="text-xs text-aj-yellow font-semibold mt-1">
                Next delivery: {new Date(nextDelivery.scheduled_date).toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short' })}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-full p-3">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1">
              {user?.date_joined
                ? new Date(user.date_joined).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })
                : 'N/A'}
            </p>
            <p className="text-sm text-gray-600">Member Since</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
              <Link href="/orders" className="text-sm text-aj-yellow hover:underline font-semibold">View All</Link>
            </div>

            {ordersLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex gap-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-xl" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No orders yet</p>
                <p className="text-sm text-gray-500 mb-6">Start shopping to see your orders here</p>
                <Link href="/products"
                  className="inline-flex items-center gap-2 bg-aj-yellow text-aj-dark px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
                >
                  Browse Products <ShoppingBag className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map(order => {
                  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING
                  const Icon = cfg.icon
                  return (
                    <Link key={order.id} href={`/orders/${order.id}`}
                      className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-aj-yellow transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 rounded-xl p-2.5 group-hover:bg-yellow-50 transition">
                          <Package className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Order #{order.id}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {' · '}{order.items?.length ?? 0} item{order.items?.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-bold text-aj-yellow text-sm">₦{Number(order.total_amount).toLocaleString()}</p>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${cfg.color}`}>
                            <Icon className="w-3 h-3" />{cfg.label}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-aj-yellow transition" />
                      </div>
                    </Link>
                  )
                })}
                {orders.length > 4 && (
                  <Link href="/orders" className="block text-center text-sm text-aj-yellow hover:underline font-semibold pt-2">
                    View all {orders.length} orders →
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/products"
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-aj-yellow to-orange-400 text-aj-dark rounded-xl hover:from-yellow-400 transition font-semibold"
                >
                  <ShoppingBag className="w-5 h-5" /> Browse Products
                </Link>
                <Link href="/orders"
                  className="flex items-center gap-3 p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition font-semibold text-gray-700"
                >
                  <Package className="w-5 h-5" /> My Orders
                </Link>
                <Link href="/products/combos"
                  className="flex items-center gap-3 p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition font-semibold text-gray-700"
                >
                  <Settings className="w-5 h-5" /> Food Bundles
                </Link>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-gray-900 mb-4">Account Info</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Email</p>
                  <p className="font-semibold text-gray-900 truncate">{user?.email || '—'}</p>
                </div>
                {user?.phone && (
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                    <p className="font-semibold text-gray-900">{user.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Cluster</p>
                  <p className="font-semibold text-gray-900">{user?.cluster?.name || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Total Spent</p>
                  <p className="font-bold text-aj-yellow">₦{totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-8 bg-gradient-to-br from-aj-green to-green-700 rounded-2xl p-8 text-white">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-bold mb-2">🎉 Refer Friends, Earn Rewards!</h3>
            <p className="mb-6 text-green-100">
              Invite your friends to join AgroBridge and get ₦500 credit for each successful referral.
            </p>
            <button className="bg-white text-aj-green px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
              Get Your Referral Link
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
