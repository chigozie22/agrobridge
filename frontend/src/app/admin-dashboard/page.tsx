'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RefreshCw, LogOut, ChevronDown, Package, Truck, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const STATUS_OPTIONS = [
  { value: 'PENDING',     label: 'Pending',      color: 'bg-yellow-100 text-yellow-800' },
  { value: 'AGGREGATING', label: 'Aggregating',  color: 'bg-blue-100 text-blue-800' },
  { value: 'CONFIRMED',   label: 'Confirmed',    color: 'bg-green-100 text-green-800' },
  { value: 'PROCESSING',  label: 'Processing',   color: 'bg-purple-100 text-purple-800' },
  { value: 'READY',       label: 'Ready',        color: 'bg-indigo-100 text-indigo-800' },
  { value: 'IN_TRANSIT',  label: 'In Transit',   color: 'bg-orange-100 text-orange-800' },
  { value: 'DELIVERED',   label: 'Delivered',    color: 'bg-green-200 text-green-900' },
  { value: 'CANCELLED',   label: 'Cancelled',    color: 'bg-red-100 text-red-800' },
]

const PAYMENT_COLORS: Record<string, string> = {
  UNPAID:  'bg-red-100 text-red-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  SUCCESS: 'bg-green-100 text-green-700',
  FAILED:  'bg-red-200 text-red-800',
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [clusters, setClusters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCluster, setFilterCluster] = useState('')
  const [updating, setUpdating] = useState<number | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) { router.push('/login'); return }
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterStatus) params.set('status', filterStatus)
      if (filterCluster) params.set('cluster', filterCluster)
      const res = await fetch(`${API_URL}/api/orders/all/?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 403) { router.push('/dashboard'); return }
      if (res.ok) setOrders(await res.json())
    } catch {}
    finally { setLoading(false) }
  }, [filterStatus, filterCluster])

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) { router.push('/login'); return }
    const u = JSON.parse(user)
    if (!u.is_staff && u.role !== 'ADMIN') { router.push('/dashboard'); return }
    fetchClusters()
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const fetchClusters = async () => {
    try {
      const res = await fetch(`${API_URL}/api/clusters/`)
      if (res.ok) setClusters(await res.json())
    } catch {}
  }

  const updateStatus = async (orderId: number, newStatus: string) => {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    setUpdating(orderId)
    setMessage(null)
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/update_status/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? data : o))
        setMessage({ type: 'success', text: `Order #${orderId} updated to ${newStatus}` })
      } else {
        setMessage({ type: 'error', text: data.error || 'Update failed' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong.' })
    } finally { setUpdating(null) }
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push('/')
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    confirmed: orders.filter(o => o.status === 'CONFIRMED').length,
    inTransit: orders.filter(o => o.status === 'IN_TRANSIT').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    revenue: orders.filter(o => o.payment_status === 'SUCCESS').reduce((s, o) => s + Number(o.total_amount), 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="text-lg sm:text-2xl font-bold whitespace-nowrap">
              <span className="text-white">Agro</span><span className="text-aj-yellow">Bridge</span>
            </span>
            <span className="bg-aj-yellow text-gray-900 text-xs font-bold px-2 py-0.5 rounded flex-shrink-0">ADMIN</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <Link href="/admin-dashboard" className="text-white font-semibold text-sm hidden sm:block">Order Management</Link>
            <Link href="/admin-dashboard/aggregation" className="text-gray-300 hover:text-white text-sm hidden sm:block">Aggregation</Link>
            <Link href="/admin-dashboard/forecasting" className="text-gray-300 hover:text-white text-sm hidden sm:block">Forecasting</Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm hidden sm:block">User Dashboard</Link>
            <Link href="/ai-planner" className="text-gray-300 hover:text-white text-sm hidden sm:block">AI Planner</Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 sm:gap-2 text-red-400 hover:text-red-300 text-sm font-semibold">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <button onClick={fetchOrders} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 transition text-sm shadow-sm">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: stats.total, color: 'text-gray-900' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
            { label: 'Confirmed', value: stats.confirmed, color: 'text-green-600' },
            { label: 'In Transit', value: stats.inTransit, color: 'text-orange-600' },
            { label: 'Delivered', value: stats.delivered, color: 'text-green-800' },
            { label: 'Revenue', value: `₦${stats.revenue.toLocaleString()}`, color: 'text-aj-yellow' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-aj-yellow appearance-none pr-8">
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={filterCluster} onChange={e => setFilterCluster(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-aj-yellow appearance-none pr-8">
              <option value="">All Clusters</option>
              {clusters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <span className="text-sm text-gray-500">{orders.length} orders</span>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold ${
            message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        {/* Orders table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aj-yellow" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-500">No orders found.</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Order', 'Customer', 'Cluster', 'Items', 'Total', 'Payment', 'Status', 'Update Status', 'Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => {
                    const statusCfg = STATUS_OPTIONS.find(s => s.value === order.status)
                    const payColor = PAYMENT_COLORS[order.payment_status] || 'bg-gray-100 text-gray-700'
                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-bold text-gray-900">
                          <Link href={`/orders/${order.id}`} className="hover:text-aj-yellow">#{order.id}</Link>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900">{order.user_name || '—'}</p>
                          <p className="text-xs text-gray-500">{order.delivery_phone}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{order.cluster_name || '—'}</td>
                        <td className="px-4 py-3 text-gray-700">{order.items?.length || 0} item(s)</td>
                        <td className="px-4 py-3 font-bold text-gray-900">₦{Number(order.total_amount).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${payColor}`}>
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusCfg?.color || 'bg-gray-100 text-gray-700'}`}>
                            {statusCfg?.label || order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative">
                            <select
                              value={order.status}
                              disabled={updating === order.id}
                              onChange={e => updateStatus(order.id, e.target.value)}
                              className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:border-aj-yellow appearance-none pr-6 disabled:opacity-50"
                            >
                              {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                            {updating === order.id
                              ? <div className="absolute right-1.5 top-1/2 -translate-y-1/2 animate-spin rounded-full h-3 w-3 border-b border-aj-yellow" />
                              : <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                            }
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
