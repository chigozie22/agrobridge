'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, MapPin, Calendar, Package, Phone, User, Mail, ChevronDown, ChevronUp, AlertCircle, Star } from 'lucide-react'
import Navbar from '@/components/Navbar'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const CRATE_PRICE = 5650

const IMAGES = {
  hero:    'https://images.unsplash.com/photo-1569288035841-428571e02b16?auto=format&fit=crop&w=1400&q=80',
  crate1:  'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
  crate2:  'https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?auto=format&fit=crop&w=600&q=80',
  farm:    '/images/cluster_image.jpg',
  fresh:   'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80',
}

const FAQS = [
  { q: 'How fresh are the eggs?', a: 'All eggs are collected within 24 hours of your delivery. We source directly from our farm in Owerri — no cold storage, no middlemen.' },
  { q: 'What is in a crate?', a: 'Each crate contains 30 eggs. You can order as many crates as you need.' },
  { q: 'How do I pay?', a: 'Payment is made on delivery (cash or transfer). Our rider will confirm your order by phone before coming.' },
  { q: 'What areas do you deliver to?', a: 'We currently deliver to all AgroBridge clusters within Owerri — FUTO, Ikenegbu, New Owerri, Egbu Road, Aladinma, and Uratta/Akachi.' },
  { q: 'Can I change my delivery date?', a: 'Yes — call the number we send in your confirmation SMS at least 12 hours before your scheduled delivery.' },
]

interface Cluster { id: number; name: string; location: string }

export default function PoultryServicesPage() {
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    cluster: '', delivery_address: '',
    delivery_date: '', crates: 1, notes: '',
  })
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [bookingId, setBookingId] = useState<number | null>(null)
  const [error, setError]       = useState('')
  const [openFaq, setOpenFaq]   = useState<number | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/api/clusters/`)
      .then(r => r.json())
      .then(d => setClusters(d.results || d))
      .catch(() => {})

    // Pre-fill from localStorage if logged in
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}')
      if (u.name)  setForm(f => ({ ...f, name: u.name }))
      if (u.phone) setForm(f => ({ ...f, phone: u.phone }))
      if (u.email) setForm(f => ({ ...f, email: u.email }))
      if (u.cluster?.id) setForm(f => ({ ...f, cluster: String(u.cluster.id) }))
    } catch {}
  }, [])

  const total = form.crates * CRATE_PRICE

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.cluster)          { setError('Please select your delivery cluster.'); return }
    if (!form.delivery_date)    { setError('Please select a delivery date.'); return }
    if (!form.delivery_address) { setError('Please enter your delivery address.'); return }

    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/poultry/bookings/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:             form.name,
          phone:            form.phone,
          email:            form.email,
          cluster:          Number(form.cluster),
          delivery_address: form.delivery_address,
          delivery_date:    form.delivery_date,
          crates:           form.crates,
          notes:            form.notes,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = Object.values(data).flat().join(' ')
        setError(msg || 'Something went wrong. Please try again.')
        return
      }
      setBookingId(data.booking_id)
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setError('Could not connect. Please check your internet and try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Minimum delivery date (tomorrow) ────────────────────────────────────────
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  // ── Success screen ───────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-6 sm:p-10 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-1">Booking reference: <span className="font-bold text-aj-yellow">#{bookingId}</span></p>
          <p className="text-gray-500 text-sm mb-6">
            We'll call <span className="font-semibold">{form.phone}</span> within 2 hours to confirm your delivery of{' '}
            <span className="font-semibold">{form.crates} crate{form.crates > 1 ? 's' : ''}</span> on{' '}
            <span className="font-semibold">{new Date(form.delivery_date).toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}</span>.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 text-sm text-left">
            <p className="font-bold text-gray-800 mb-1">Total to pay on delivery</p>
            <p className="text-3xl font-bold text-aj-yellow">₦{total.toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-1">{form.crates} crate{form.crates > 1 ? 's' : ''} × ₦{CRATE_PRICE.toLocaleString()}</p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setSuccess(false); setForm(f => ({ ...f, name: '', phone: '', email: '', cluster: '', delivery_address: '', delivery_date: '', crates: 1, notes: '' })) }}
              className="w-full bg-aj-yellow text-aj-dark py-3 rounded-xl font-bold hover:bg-yellow-400 transition"
            >
              Book Another Order
            </button>
            <Link href="/" className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition text-center">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">

      <Navbar
        links={[
          { href: '/products', label: 'Shop' },
          { href: '/poultry-services', label: 'Poultry Services', active: true },
          { href: '/ai-planner', label: 'AI Planner' },
        ]}
        rightSlot={
          <Link href="/login" className="bg-aj-yellow text-aj-dark px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition">
            Sign In
          </Link>
        }
      />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative h-[520px] md:h-[600px] overflow-hidden">
        <img
          src={IMAGES.hero}
          alt="Fresh farm eggs"
          className="w-full h-full object-cover"
          onError={e => { (e.target as HTMLImageElement).src = IMAGES.crate1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-xl">
              <span className="inline-block bg-aj-yellow text-aj-dark text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                AJFreshFarmFoods Poultry Services
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                Fresh Farm Eggs,<br />
                <span className="text-aj-yellow">Delivered to Your Door</span>
              </h1>
              <p className="text-gray-200 text-lg mb-8">
                Straight from our farm in Owerri. No cold storage, no middlemen —
                just fresh eggs at your cluster the very next day.
              </p>
              <a href="#book"
                className="inline-flex items-center gap-2 bg-aj-yellow text-aj-dark px-8 py-4 rounded-2xl font-bold text-lg hover:bg-yellow-400 transition shadow-lg"
              >
                Book Now — ₦5,650/crate
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────────────── */}
      <div className="bg-aj-dark text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {[
            { label: 'Per crate (30 eggs)', value: '₦5,650' },
            { label: 'Delivery areas',      value: '6 Clusters' },
            { label: 'Freshness',           value: '< 24 hrs' },
            { label: 'Payment',             value: 'On Delivery' },
          ].map(s => (
            <div key={s.label} className="px-4 py-2 text-center">
              <p className="text-aj-yellow font-bold text-xl">{s.value}</p>
              <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Why choose us ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Why AJFreshFarmFoods?</h2>
          <p className="text-gray-500 max-w-xl mx-auto">We raise our own poultry and deliver directly — no wholesaler markup, no stale stock.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              img: IMAGES.crate1,
              title: 'Farm-to-Door Fresh',
              desc: 'Eggs are collected within 24 hours of your delivery. Your crate leaves the farm the morning of delivery.',
            },
            {
              img: IMAGES.farm,
              title: 'Cluster-Based Delivery',
              desc: 'We deliver to all 6 major residential clusters in Owerri. Your rider calls 30 minutes before arriving.',
            },
            {
              img: IMAGES.crate2,
              title: 'Simple & Transparent',
              desc: '₦5,650 per crate of 30 eggs. Low delivery charges apply based on your cluster. Pay cash or transfer on delivery.',
            },
          ].map(card => (
            <div key={card.title} className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition group">
              <div className="h-48 overflow-hidden">
                <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={e => { (e.target as HTMLImageElement).src = IMAGES.crate1 }} />
              </div>
              <div className="p-6 bg-white">
                <h3 className="font-bold text-gray-900 text-lg mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Star ratings row */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1 mb-1">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-aj-yellow text-aj-yellow" />)}
              <span className="text-gray-700 font-bold ml-2">4.9 / 5</span>
            </div>
            <p className="text-gray-600 text-sm">"Fresh every time. My family has been ordering for 3 months." — <em>Ngozi, New Owerri</em></p>
          </div>
          <a href="#book" className="bg-aj-yellow text-aj-dark px-6 py-3 rounded-xl font-bold whitespace-nowrap hover:bg-yellow-400 transition">
            Place Your Order
          </a>
        </div>
      </section>

      {/* ── Booking Form ────────────────────────────────────────────────────── */}
      <section id="book" className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Book Your Delivery</h2>
            <p className="text-gray-500">Fill the form below and we'll call to confirm within 2 hours.</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 max-w-2xl mx-auto">
              <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
            </div>
          )}

          <div className="grid lg:grid-cols-5 gap-8">

            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5 bg-white rounded-2xl shadow-lg p-4 sm:p-8">

              {/* Contact */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-aj-yellow" /> Your Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                    <input required type="text" placeholder="e.g. Chigozie Okonkwo"
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-aj-yellow focus:outline-none text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                    <input required type="tel" placeholder="080xxxxxxxx"
                      value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-aj-yellow focus:outline-none text-sm text-gray-900"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="email" placeholder="for booking confirmation"
                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-aj-yellow focus:outline-none text-sm text-gray-900"
                  />
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Delivery */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-aj-yellow" /> Delivery Details
                </h3>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Cluster / Area *</label>
                    <select required
                      value={form.cluster} onChange={e => setForm(f => ({ ...f, cluster: e.target.value }))}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-aj-yellow focus:outline-none text-sm text-gray-900 bg-white"
                    >
                      <option value="">Select your area...</option>
                      {clusters.length > 0
                        ? clusters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                        : [
                            { id: 1, name: 'FUTO Main Hostels' },
                            { id: 2, name: 'Ikenegbu Layout' },
                            { id: 3, name: 'New Owerri' },
                            { id: 4, name: 'Egbu Road Area' },
                            { id: 5, name: 'Aladinma Estate' },
                            { id: 6, name: 'Uratta / Akachi' },
                          ].map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                      }
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Delivery Date *</label>
                    <input required type="date" min={minDate}
                      value={form.delivery_date} onChange={e => setForm(f => ({ ...f, delivery_date: e.target.value }))}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-aj-yellow focus:outline-none text-sm text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Delivery Address *</label>
                  <textarea required rows={2} placeholder="Room/house number, street, landmark..."
                    value={form.delivery_address} onChange={e => setForm(f => ({ ...f, delivery_address: e.target.value }))}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-aj-yellow focus:outline-none text-sm resize-none"
                  />
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Quantity */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-aj-yellow" /> Order Quantity
                </h3>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <button type="button"
                    onClick={() => setForm(f => ({ ...f, crates: Math.max(1, f.crates - 1) }))}
                    className="w-11 h-11 flex-shrink-0 rounded-xl border-2 border-gray-200 bg-white flex items-center justify-center hover:border-aj-yellow hover:bg-yellow-50 transition select-none"
                    style={{ fontSize: '1.5rem', lineHeight: 1, fontWeight: 700, color: '#1A1A1A' }}
                  >
                    <span aria-hidden="true">&#8722;</span>
                  </button>
                  <div className="text-center min-w-[60px]">
                    <p className="text-3xl font-bold text-gray-900">{form.crates}</p>
                    <p className="text-xs text-gray-500">crate{form.crates > 1 ? 's' : ''} ({form.crates * 30} eggs)</p>
                  </div>
                  <button type="button"
                    onClick={() => setForm(f => ({ ...f, crates: Math.min(100, f.crates + 1) }))}
                    className="w-11 h-11 flex-shrink-0 rounded-xl border-2 border-gray-200 bg-white flex items-center justify-center hover:border-aj-yellow hover:bg-yellow-50 transition select-none"
                    style={{ fontSize: '1.5rem', lineHeight: 1, fontWeight: 700, color: '#1A1A1A' }}
                  >
                    <span aria-hidden="true">&#43;</span>
                  </button>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-xl font-bold text-aj-yellow">₦{total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" placeholder="Gate colour, preferred delivery time, etc."
                  value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-aj-yellow focus:outline-none text-sm text-gray-900"
                />
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-aj-yellow to-orange-400 text-aj-dark py-4 rounded-2xl font-bold text-lg hover:from-yellow-400 transition disabled:opacity-60 flex items-center justify-center gap-3"
              >
                {loading
                  ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-aj-dark" /> Processing...</>
                  : <><CheckCircle className="w-5 h-5" /> Confirm Booking — ₦{total.toLocaleString()}</>
                }
              </button>
              <p className="text-center text-xs text-gray-400">Pay on delivery · Low delivery charges apply · No upfront payment required</p>
            </form>

            {/* Sidebar summary */}
            <div className="lg:col-span-2 space-y-6">

              {/* Egg image */}
              <div className="rounded-2xl overflow-hidden shadow-md h-52">
                <img src={IMAGES.fresh} alt="Fresh eggs" className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = IMAGES.crate1 }} />
              </div>

              {/* Order summary */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per crate</span>
                    <span className="font-semibold">₦{CRATE_PRICE.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Crates ordered</span>
                    <span className="font-semibold">{form.crates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total eggs</span>
                    <span className="font-semibold">{form.crates * 30}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery fee</span>
                    <span className="font-semibold text-aj-yellow">Low charges apply</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Total (pay on delivery)</span>
                    <span className="font-bold text-aj-yellow text-lg">₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="bg-aj-dark rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-4">How It Works</h3>
                <ol className="space-y-3 text-sm">
                  {[
                    'Fill the booking form',
                    'We call to confirm within 2 hrs',
                    'Rider delivers on your chosen date',
                    'Pay on delivery — cash or transfer',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="bg-aj-yellow text-aj-dark rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-900 hover:bg-gray-50 transition"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                {openFaq === i
                  ? <ChevronUp className="w-5 h-5 text-aj-yellow flex-shrink-0" />
                  : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-gray-600 text-sm">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-aj-yellow to-orange-400 py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-aj-dark mb-3">Ready for Fresh Eggs?</h2>
        <p className="text-aj-dark/80 mb-8 max-w-md mx-auto">
          Join hundreds of families in Owerri getting farm-fresh eggs delivered straight to their door.
        </p>
        <a href="#book"
          className="inline-block bg-aj-dark text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition"
        >
          Book Now
        </a>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-aj-dark text-gray-400 text-center py-6 text-sm">
        <p>AJFreshFarmFoods Poultry Services · A service by <Link href="/" className="text-aj-yellow hover:underline">AgroBridge</Link></p>
      </footer>
    </div>
  )
}
