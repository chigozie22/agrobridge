'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LogOut, ChevronDown, Layers, Wallet, TrendingUp, Store, Package,
  AlertCircle, Loader2, History, ArrowRight,
} from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface PriceOptimization {
  id: number
  product_name: string
  total_quantity_needed: string
  vendor_name: string
  selected_price: string
  market_average_price: string
  savings_per_unit: string
  total_savings: string
  alternatives_evaluated: number
}

interface VendorAllocation {
  id: number
  vendor_name: string
  total_items: number
  total_value: string
  status_display: string
}

interface AggregationRun {
  id: number
  run_number: string
  cluster: number
  cluster_name: string
  status: string
  status_display: string
  started_at: string
  completed_at: string | null
  total_orders: number
  total_order_value: string
  total_savings: string
  average_savings_percentage: string
  vendors_involved: number
  notes: string
  price_optimizations: PriceOptimization[]
  vendor_allocations: VendorAllocation[]
}

export default function AggregationPage() {
  const router = useRouter()
  const [clusters, setClusters] = useState<any[]>([])
  const [selectedCluster, setSelectedCluster] = useState('')
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')
  const [activeRun, setActiveRun] = useState<AggregationRun | null>(null)
  const [history, setHistory] = useState<AggregationRun[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)

  const fetchHistory = useCallback(async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    setHistoryLoading(true)
    try {
      const params = selectedCluster ? `?cluster=${selectedCluster}` : ''
      const res = await fetch(`${API_URL}/api/aggregation/runs/${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setHistory(data.results || data)
      }
    } catch {}
    finally { setHistoryLoading(false) }
  }, [selectedCluster])

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) { router.push('/login'); return }
    const u = JSON.parse(user)
    if (!u.is_staff && u.role !== 'ADMIN') { router.push('/dashboard'); return }
    fetchClusters()
  }, [])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const fetchClusters = async () => {
    try {
      const res = await fetch(`${API_URL}/api/clusters/`)
      if (res.ok) setClusters(await res.json())
    } catch {}
  }

  const runAggregation = async () => {
    if (!selectedCluster) { setError('Pick a cluster first.'); return }
    const token = localStorage.getItem('accessToken')
    if (!token) { router.push('/login'); return }

    setRunning(true)
    setError('')
    setActiveRun(null)
    try {
      const res = await fetch(`${API_URL}/api/aggregation/runs/trigger/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cluster_id: Number(selectedCluster) }),
      })
      const data = await res.json()
      if (res.ok) {
        setActiveRun(data)
        fetchHistory()
      } else {
        setError(data.error || 'Could not run aggregation.')
      }
    } catch {
      setError('Something went wrong reaching the server.')
    } finally {
      setRunning(false)
    }
  }

  const viewRun = async (runId: number) => {
    const token = localStorage.getItem('accessToken')
    if (!token) { router.push('/login'); return }
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/aggregation/runs/${runId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setActiveRun(await res.json())
      } else {
        setError('Could not load that run.')
      }
    } catch {
      setError('Something went wrong reaching the server.')
    }
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
            <Link href="/admin-dashboard/aggregation" className="text-white font-semibold text-sm hidden sm:block">Aggregation</Link>
            <Link href="/admin-dashboard/forecasting" className="text-gray-300 hover:text-white text-sm hidden sm:block">Forecasting</Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm hidden sm:block">User Dashboard</Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 sm:gap-2 text-red-400 hover:text-red-300 text-sm font-semibold">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Aggregation Engine</h1>
          <p className="text-gray-500 text-sm mt-1">
            Batch a cluster's confirmed orders, match each product to its cheapest available vendor,
            and calculate bulk savings.
          </p>
        </div>

        {/* Trigger card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="font-bold text-gray-800 mb-4">Run a new aggregation</h2>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cluster</label>
              <div className="relative">
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
            </div>
            <button
              onClick={runAggregation}
              disabled={running || !selectedCluster}
              className="bg-gradient-to-r from-aj-yellow to-orange-400 text-aj-dark px-6 py-3 rounded-xl font-bold hover:from-yellow-400 hover:to-orange-500 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {running ? <><Loader2 className="w-4 h-4 animate-spin" /> Running...</> : <><Layers className="w-4 h-4" /> Run Aggregation</>}
            </button>
          </div>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
        </div>

        {/* Active run result */}
        {activeRun && (
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-800">
                Run {activeRun.run_number} — <span className="text-gray-500 font-normal">{activeRun.cluster_name}</span>
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                {activeRun.status_display}
              </span>
            </div>

            {activeRun.notes && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl text-sm">
                {activeRun.notes}
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Orders Batched', value: activeRun.total_orders, icon: Package, color: 'text-gray-900' },
                { label: 'Total Value', value: `₦${Number(activeRun.total_order_value).toLocaleString()}`, icon: Wallet, color: 'text-gray-900' },
                { label: 'Total Savings', value: `₦${Number(activeRun.total_savings).toLocaleString()}`, icon: TrendingUp, color: 'text-aj-green' },
                { label: 'Savings %', value: `${activeRun.average_savings_percentage}%`, icon: TrendingUp, color: 'text-aj-yellow' },
                { label: 'Vendors', value: activeRun.vendors_involved, icon: Store, color: 'text-gray-900' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm">
                  <s.icon className="w-5 h-5 text-gray-400 mb-2" />
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Vendor allocations */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-4">Vendor Allocations</h3>
              {activeRun.vendor_allocations.length === 0 ? (
                <p className="text-sm text-gray-500">No vendors allocated.</p>
              ) : (
                <div className="space-y-2">
                  {activeRun.vendor_allocations.map(va => (
                    <div key={va.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{va.vendor_name}</p>
                        <p className="text-xs text-gray-500">{va.total_items} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm">₦{Number(va.total_value).toLocaleString()}</p>
                        <span className="text-xs text-gray-500">{va.status_display}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price optimizations */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-4">Price Optimizations</h3>
              {activeRun.price_optimizations.length === 0 ? (
                <p className="text-sm text-gray-500">No products were sourced in this run.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {['Product', 'Qty', 'Vendor', 'Price', 'Market Avg', 'Savings'].map(h => (
                          <th key={h} className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {activeRun.price_optimizations.map(po => (
                        <tr key={po.id}>
                          <td className="px-3 py-2 font-semibold text-gray-900 whitespace-nowrap">{po.product_name}</td>
                          <td className="px-3 py-2 text-gray-700">{po.total_quantity_needed}</td>
                          <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{po.vendor_name}</td>
                          <td className="px-3 py-2 text-gray-900">₦{Number(po.selected_price).toLocaleString()}</td>
                          <td className="px-3 py-2 text-gray-500">₦{Number(po.market_average_price).toLocaleString()}</td>
                          <td className="px-3 py-2 font-bold text-aj-green whitespace-nowrap">₦{Number(po.total_savings).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <History className="w-4 h-4 text-gray-400" /> Past Runs {selectedCluster && '(filtered by selected cluster)'}
          </h2>
          {historyLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aj-yellow" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-sm text-gray-500">No aggregation runs yet.</p>
          ) : (
            <div className="space-y-2">
              {history.map(run => (
                <button
                  key={run.id}
                  onClick={() => viewRun(run.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-aj-yellow transition text-left"
                >
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{run.run_number} — {run.cluster_name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(run.started_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' · '}{run.total_orders} orders · ₦{Number(run.total_savings).toLocaleString()} saved
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
