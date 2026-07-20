'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LogOut, ChevronDown, TrendingUp, TrendingDown, Minus, Package,
  AlertCircle, Loader2, BarChart3,
} from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ProductForecast {
  product_id: number
  product_name: string
  unit: string
  weekly_history: number[]
  projected_next_week_quantity: number
  trend: 'up' | 'down' | 'flat'
  data_points: number
  cheapest_price: string | null
  known_vendor_stock: string | null
}

interface ForecastResponse {
  cluster_id: number
  cluster_name: string
  weeks_analyzed: number
  product_count: number
  forecasts: ProductForecast[]
}

const TREND_META: Record<string, { icon: any; color: string; label: string }> = {
  up:   { icon: TrendingUp,   color: 'text-aj-green',  label: 'Rising' },
  down: { icon: TrendingDown, color: 'text-red-500',   label: 'Falling' },
  flat: { icon: Minus,        color: 'text-gray-400',  label: 'Flat' },
}

export default function ForecastingPage() {
  const router = useRouter()
  const [clusters, setClusters] = useState<any[]>([])
  const [selectedCluster, setSelectedCluster] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<ForecastResponse | null>(null)

  const fetchForecast = useCallback(async () => {
    if (!selectedCluster) { setData(null); return }
    const token = localStorage.getItem('accessToken')
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/forecasting/demand/?cluster=${selectedCluster}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const body = await res.json()
      if (res.ok) {
        setData(body)
      } else {
        setError(body.error || 'Could not load the forecast.')
        setData(null)
      }
    } catch {
      setError('Something went wrong reaching the server.')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [selectedCluster])

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) { router.push('/login'); return }
    const u = JSON.parse(user)
    if (!u.is_staff && u.role !== 'ADMIN') { router.push('/dashboard'); return }
    fetchClusters()
  }, [])

  useEffect(() => { fetchForecast() }, [fetchForecast])

  const fetchClusters = async () => {
    try {
      const res = await fetch(`${API_URL}/api/clusters/`)
      if (res.ok) setClusters(await res.json())
    } catch {}
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push('/')
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
            <Link href="/admin-dashboard" className="text-gray-300 hover:text-white text-sm hidden sm:block">Order Management</Link>
            <Link href="/admin-dashboard/aggregation" className="text-gray-300 hover:text-white text-sm hidden sm:block">Aggregation</Link>
            <Link href="/admin-dashboard/forecasting" className="text-white font-semibold text-sm hidden sm:block">Forecasting</Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm hidden sm:block">User Dashboard</Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 sm:gap-2 text-red-400 hover:text-red-300 text-sm font-semibold">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Supply Forecasting</h1>
          <p className="text-gray-500 text-sm mt-1">
            Projects each cluster's likely demand next week from its recent order history — a simple
            statistical trend, not a live guarantee. Use it to spot demand trending up before it happens.
          </p>
        </div>

        {/* Cluster picker */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="font-bold text-gray-800 mb-4">Choose a cluster</h2>
          <div className="relative inline-block">
            <select
              value={selectedCluster}
              onChange={e => setSelectedCluster(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm text-gray-900 bg-white focus:outline-none focus:border-aj-yellow appearance-none min-w-[220px]"
            >
              <option value="">Select a cluster...</option>
              {clusters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-aj-yellow animate-spin" />
          </div>
        ) : !selectedCluster ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-500">
            <BarChart3 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            Pick a cluster above to see its demand forecast.
          </div>
        ) : data && data.forecasts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-500">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            Not enough order history yet for this cluster — check back once it's placed a few orders.
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xl font-bold text-gray-900">{data.weeks_analyzed} weeks</p>
                <p className="text-xs text-gray-500 mt-0.5">Of order history analyzed</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xl font-bold text-gray-900">{data.product_count}</p>
                <p className="text-xs text-gray-500 mt-0.5">Products with a forecast</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-4">Projected demand next week</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Product', 'Trend', 'Recent Weekly Qty', 'Projected Next Week', 'Price', 'Vendor Stock'].map(h => (
                        <th key={h} className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.forecasts.map(f => {
                      const meta = TREND_META[f.trend]
                      const TrendIcon = meta.icon
                      return (
                        <tr key={f.product_id}>
                          <td className="px-3 py-2 font-semibold text-gray-900 whitespace-nowrap">{f.product_name}</td>
                          <td className="px-3 py-2">
                            <span className={`flex items-center gap-1 font-semibold ${meta.color}`}>
                              <TrendIcon className="w-4 h-4" /> {meta.label}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-gray-500 whitespace-nowrap font-mono text-xs">
                            {f.weekly_history.join(' · ')}
                          </td>
                          <td className="px-3 py-2 font-bold text-gray-900">
                            {f.projected_next_week_quantity} {f.unit}
                          </td>
                          <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                            {f.cheapest_price ? `₦${Number(f.cheapest_price).toLocaleString()}` : '—'}
                          </td>
                          <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                            {f.known_vendor_stock != null ? `${Number(f.known_vendor_stock).toLocaleString()} ${f.unit}` : 'Unknown'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
