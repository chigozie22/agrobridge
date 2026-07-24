'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Package, MapPin, Phone, Truck, CheckCircle, Clock, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import Navbar from '@/components/Navbar'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY', 'IN_TRANSIT', 'DELIVERED']

const STATUS_CONFIG: Record<string, { label: string; desc: string; icon: any; color: string }> = {
  PENDING:     { label: 'Order Placed',       desc: 'Waiting to be confirmed',        icon: Clock,        color: 'text-yellow-500' },
  AGGREGATING: { label: 'Aggregating',        desc: 'Combining cluster orders',       icon: Package,      color: 'text-blue-500' },
  CONFIRMED:   { label: 'Confirmed & Paid',   desc: 'Payment received, order locked', icon: CheckCircle,  color: 'text-green-500' },
  PROCESSING:  { label: 'Being Prepared',     desc: 'Vendors packing your order',     icon: Package,      color: 'text-purple-500' },
  READY:       { label: 'Ready for Pickup',   desc: 'Handed to delivery rider',       icon: CheckCircle,  color: 'text-indigo-500' },
  IN_TRANSIT:  { label: 'On the Way',         desc: 'Rider heading to your cluster',  icon: Truck,        color: 'text-orange-500' },
  DELIVERED:   { label: 'Delivered',          desc: 'Order delivered successfully',   icon: CheckCircle,  color: 'text-green-600' },
  CANCELLED:   { label: 'Cancelled',          desc: 'This order was cancelled',       icon: XCircle,      color: 'text-red-500' },
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) { router.push('/login'); return }
    fetchOrder(token)
  }, [id])

  const fetchOrder = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) { router.push('/orders'); return }
      const data = await res.json()
      setOrder(data)
      // Auto-verify after order loads if redirected back from Paystack
      if (searchParams.get('verify') === '1') {
        verifyPayment(token)
      }
    } catch {}
    finally { setLoading(false) }
  }

  const verifyPayment = async (token?: string) => {
    const t = token || localStorage.getItem('accessToken')
    if (!t) return
    setVerifying(true)
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/verify_payment/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${t}` }
      })
      const data = await res.json()
      if (res.ok) {
        setOrder(data)
        setMessage('Payment confirmed! Your order is now active.')
      } else {
        setMessage(data.error || 'Payment verification failed.')
      }
    } catch {
      setMessage('Could not verify payment. Try again.')
    } finally {
      setVerifying(false)
    }
  }

  const cancelOrder = async () => {
    if (!confirm('Cancel this order?')) return
    const token = localStorage.getItem('accessToken')
    if (!token) return
    setCancelLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/cancel/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) setOrder(data)
      else setMessage(data.error || 'Could not cancel.')
    } catch {
      setMessage('Something went wrong.')
    } finally {
      setCancelLoading(false) }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aj-yellow" />
      </div>
    )
  }

  if (!order) return null

  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING
  const Icon = cfg.icon
  const currentStep = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        links={[
          { href: '/orders', label: 'My Orders' },
          { href: '/ai-planner', label: 'AI Planner' },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-aj-yellow mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> All Orders
        </Link>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold ${
            message.includes('confirmed') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {message}
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
              <p className="text-gray-500 text-sm mt-1">
                Placed {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className={`flex items-center gap-2 font-bold ${cfg.color}`}>
              <Icon className="w-5 h-5" />
              {cfg.label}
            </div>
          </div>

          {/* Payment status banner */}
          {order.payment_status === 'UNPAID' && order.status !== 'CANCELLED' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-red-700 text-sm">Payment Required</p>
                <p className="text-xs text-red-600">This order won't be processed until payment is confirmed.</p>
              </div>
              <button
                onClick={() => verifyPayment()}
                disabled={verifying}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 transition flex items-center gap-2 disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${verifying ? 'animate-spin' : ''}`} />
                Verify Payment
              </button>
            </div>
          )}
          {order.payment_status === 'SUCCESS' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-700 text-sm font-semibold">
                Payment confirmed {order.paid_at ? `on ${new Date(order.paid_at).toLocaleDateString('en-NG')}` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Status Timeline */}
        {order.status !== 'CANCELLED' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Order Progress</h2>
            <div className="relative">
              {STATUS_STEPS.map((step, idx) => {
                const stepCfg = STATUS_CONFIG[step]
                const StepIcon = stepCfg.icon
                const done = currentStep >= idx
                const active = currentStep === idx
                return (
                  <div key={step} className="flex items-start gap-4 mb-5 last:mb-0 relative">
                    {idx < STATUS_STEPS.length - 1 && (
                      <div className={`absolute left-4 top-8 w-0.5 h-6 ${done && currentStep > idx ? 'bg-aj-yellow' : 'bg-gray-200'}`} />
                    )}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      done ? 'bg-aj-yellow' : 'bg-gray-200'
                    }`}>
                      <StepIcon className={`w-4 h-4 ${done ? 'text-aj-dark' : 'text-gray-400'}`} />
                    </div>
                    <div className="pt-1">
                      <p className={`text-sm font-bold ${active ? 'text-gray-900' : done ? 'text-gray-700' : 'text-gray-400'}`}>
                        {stepCfg.label}
                      </p>
                      {active && <p className="text-xs text-gray-500 mt-0.5">{stepCfg.desc}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Items */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-aj-yellow" /> Items Ordered
            </h2>
            <div className="space-y-3">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">x{item.quantity} · {item.type}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900">₦{Number(item.subtotal).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-1">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery fee</span><span>₦{Number(order.delivery_fee).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900">
                <span>Total</span><span className="text-aj-yellow">₦{Number(order.total_amount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Delivery info */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-aj-yellow" /> Delivery Info
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-700">Cluster</p>
                  <p className="text-gray-600">{order.cluster_name || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-700">Address</p>
                  <p className="text-gray-600">{order.delivery_address}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-700">Phone</p>
                  <p className="text-gray-600">{order.delivery_phone}</p>
                </div>
              </div>
              {order.delivery_notes && (
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 italic">
                  "{order.delivery_notes}"
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cancel */}
        {['PENDING', 'AGGREGATING'].includes(order.status) && order.payment_status !== 'SUCCESS' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-red-100">
            <h3 className="font-bold text-gray-900 mb-1">Cancel Order</h3>
            <p className="text-sm text-gray-500 mb-4">You can cancel this order before it's confirmed.</p>
            <button
              onClick={cancelOrder}
              disabled={cancelLoading}
              className="bg-red-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-600 transition text-sm disabled:opacity-60"
            >
              {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
