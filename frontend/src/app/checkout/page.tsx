'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, MapPin, Phone, Truck, CheckCircle, AlertCircle } from 'lucide-react'
import { useCart } from '@/context/CartContext'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart, itemCount } = useCart()

  const [form, setForm] = useState({ delivery_address: '', delivery_phone: '', delivery_notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cluster, setCluster] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('accessToken')
    if (!token) { router.push('/login'); return }
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      if (u.phone) setForm(f => ({ ...f, delivery_phone: u.phone }))
    }
    fetchCluster(token)
  }, [])

  const fetchCluster = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/profile/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.cluster) setCluster(data.cluster)
    } catch {}
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.delivery_address.trim()) { setError('Delivery address is required'); return }
    if (!form.delivery_phone.trim()) { setError('Phone number is required'); return }
    if (items.length === 0) { setError('Your cart is empty'); return }

    setLoading(true)
    setError('')

    const token = localStorage.getItem('accessToken')
    if (!token) { router.push('/login'); return }

    try {
      // 1. Create order
      const orderRes = await fetch(`${API_URL}/api/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          delivery_address: form.delivery_address,
          delivery_phone: form.delivery_phone,
          delivery_notes: form.delivery_notes,
          items: items.map(i => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            type: i.type,
          })),
        }),
      })

      if (!orderRes.ok) {
        const err = await orderRes.json()
        setError(err.detail || JSON.stringify(err))
        return
      }

      const order = await orderRes.json()

      // 2. Initiate Paystack payment
      const payRes = await fetch(`${API_URL}/api/orders/${order.id}/initiate_payment/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!payRes.ok) {
        // Order created but payment failed — send to order page
        clearCart()
        router.push(`/orders/${order.id}?payment_error=1`)
        return
      }

      const payData = await payRes.json()
      clearCart()

      // 3. Redirect to Paystack
      window.location.href = payData.authorization_url
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const deliveryFee = cluster?.delivery_fee ?? 0
  const grandTotal = total + Number(deliveryFee)

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <Link href="/products" className="text-aj-yellow hover:underline font-semibold">
            ← Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-gray-900">Agro</span><span className="text-aj-yellow">Bridge</span>
          </Link>
          <Link href="/products" className="flex items-center gap-2 text-gray-600 hover:text-aj-yellow">
            <ShoppingCart className="w-4 h-4" /> Cart ({itemCount})
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-aj-yellow mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Delivery Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Cluster info */}
            {cluster && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-start gap-3">
                <Truck className="w-5 h-5 text-aj-yellow flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900">{cluster.name}</p>
                  <p className="text-sm text-gray-600">{cluster.location}</p>
                  <p className="text-sm text-aj-yellow font-semibold mt-1">Delivery fee: ₦{Number(cluster.delivery_fee).toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* Address */}
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-aj-yellow" /> Delivery Details
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Delivery Address *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Room/House number, hostel block, street name..."
                  value={form.delivery_address}
                  onChange={e => setForm(f => ({ ...f, delivery_address: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-aj-yellow focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="080xxxxxxxx"
                    value={form.delivery_phone}
                    onChange={e => setForm(f => ({ ...f, delivery_phone: e.target.value }))}
                    className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:border-aj-yellow focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Delivery Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="text"
                  placeholder="Landmark, gate colour, preferred time..."
                  value={form.delivery_notes}
                  onChange={e => setForm(f => ({ ...f, delivery_notes: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-aj-yellow focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-aj-yellow to-orange-400 text-aj-dark py-4 rounded-2xl font-bold text-lg hover:from-yellow-400 hover:to-orange-500 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-aj-dark" /> Processing...</>
              ) : (
                <><CheckCircle className="w-5 h-5" /> Pay ₦{grandTotal.toLocaleString()} with Paystack</>
              )}
            </button>
            <p className="text-center text-xs text-gray-500">Secured by Paystack — your payment is 100% safe</p>
          </form>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-tight truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery fee</span>
                  <span>₦{Number(deliveryFee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-100 pt-2">
                  <span>Total</span>
                  <span className="text-aj-yellow">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <p className="text-sm text-green-700 font-semibold mb-1">💡 AgroBridge Savings</p>
              <p className="text-xs text-green-600">Your order joins the cluster batch — you're saving 20-30% vs buying individually.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
