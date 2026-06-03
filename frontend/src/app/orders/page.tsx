'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, AlertCircle } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  PENDING:      { label: 'Pending',          color: 'bg-yellow-100 text-yellow-700',  icon: Clock },
  AGGREGATING:  { label: 'Aggregating',      color: 'bg-blue-100 text-blue-700',      icon: Package },
  CONFIRMED:    { label: 'Confirmed',        color: 'bg-green-100 text-green-700',    icon: CheckCircle },
  PROCESSING:   { label: 'Processing',       color: 'bg-purple-100 text-purple-700',  icon: Package },
  READY:        { label: 'Ready',            color: 'bg-indigo-100 text-indigo-700',  icon: CheckCircle },
  IN_TRANSIT:   { label: 'On the Way',       color: 'bg-orange-100 text-orange-700',  icon: Truck },
  DELIVERED:    { label: 'Delivered',        color: 'bg-green-100 text-green-800',    icon: CheckCircle },
  CANCELLED:    { label: 'Cancelled',        color: 'bg-red-100 text-red-700',        icon: XCircle },
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) { router.push('/login'); return }
    fetchOrders(token)
  }, [])

  const fetchOrders = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : data.results || [])
    } catch {}
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-gray-900">Agro</span><span className="text-aj-yellow">Bridge</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/products" className="text-gray-600 hover:text-aj-yellow">Shop</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-aj-yellow">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-1">Track your AgroBridge deliveries</p>
          </div>
          <Link href="/products" className="bg-aj-yellow text-aj-dark px-4 py-2 rounded-xl font-bold hover:bg-yellow-400 transition text-sm">
            + New Order
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="text-7xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Your first order will appear here once you place it.</p>
            <Link href="/products" className="bg-aj-yellow text-aj-dark px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING
              const Icon = cfg.icon
              return (
                <Link key={order.id} href={`/orders/${order.id}`}
                  className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 border-2 border-transparent hover:border-aj-yellow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-gray-900">Order #{order.id}</span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.color}`}>
                          <Icon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                        {order.payment_status === 'SUCCESS' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3" /> Paid
                          </span>
                        )}
                        {order.payment_status === 'UNPAID' && order.status !== 'CANCELLED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
                            <AlertCircle className="w-3 h-3" /> Unpaid
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        {order.items?.length ?? 0} item{order.items?.length !== 1 ? 's' : ''} · {order.cluster_name || 'No cluster'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-bold text-aj-yellow">₦{Number(order.total_amount).toLocaleString()}</p>
                      <ChevronRight className="w-5 h-5 text-gray-400 ml-auto mt-1" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
