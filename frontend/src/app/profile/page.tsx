'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Phone, MapPin, Lock, CheckCircle, AlertCircle, LogOut, ChevronDown } from 'lucide-react'
import Navbar from '@/components/Navbar'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [clusters, setClusters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [pwMessage, setPwMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [form, setForm] = useState({ name: '', phone: '', address: '', cluster_id: '' })
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', confirm: '' })

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) { router.push('/login'); return }
    fetchProfile(token)
    fetchClusters()
  }, [])

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) { router.push('/login'); return }
      const data = await res.json()
      setUser(data)
      setForm({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
        cluster_id: data.cluster?.id ? String(data.cluster.id) : '',
      })
    } catch {}
    finally { setLoading(false) }
  }

  const fetchClusters = async () => {
    try {
      const res = await fetch(`${API_URL}/api/clusters/`)
      if (res.ok) setClusters(await res.json())
    } catch {}
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('accessToken')
    if (!token) return
    setSaving(true)
    setMessage(null)
    try {
      const body: any = { name: form.name, phone: form.phone, address: form.address }
      if (form.cluster_id) body.cluster_id = Number(form.cluster_id)
      else body.cluster_id = null

      const res = await fetch(`${API_URL}/api/auth/profile/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.ok) {
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        setMessage({ type: 'error', text: data.detail || JSON.stringify(data) })
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong. Try again.' })
    } finally { setSaving(false) }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwForm.new_password !== pwForm.confirm) {
      setPwMessage({ type: 'error', text: 'New passwords do not match.' })
      return
    }
    const token = localStorage.getItem('accessToken')
    if (!token) return
    setPwLoading(true)
    setPwMessage(null)
    try {
      const res = await fetch(`${API_URL}/api/auth/change-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ old_password: pwForm.old_password, new_password: pwForm.new_password }),
      })
      const data = await res.json()
      if (res.ok) {
        setPwMessage({ type: 'success', text: 'Password changed successfully!' })
        setPwForm({ old_password: '', new_password: '', confirm: '' })
      } else {
        setPwMessage({ type: 'error', text: data.error || JSON.stringify(data) })
      }
    } catch {
      setPwMessage({ type: 'error', text: 'Something went wrong. Try again.' })
    } finally { setPwLoading(false) }
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aj-yellow" />
      </div>
    )
  }

  const selectedCluster = clusters.find(c => String(c.id) === form.cluster_id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        links={[
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/ai-planner', label: 'AI Planner' },
        ]}
        rightSlot={
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-semibold">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        }
      />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-aj-yellow mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        {/* Current cluster banner */}
        {user?.cluster && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-aj-yellow flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900 text-sm">{user.cluster.name}</p>
              <p className="text-xs text-gray-500">{user.cluster.location} · Delivery fee: ₦{Number(user.cluster.delivery_fee).toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Profile form */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <User className="w-5 h-5 text-aj-yellow" /> Personal Information
          </h2>

          {message && (
            <div className={`mb-4 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold ${
              message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-aj-yellow focus:outline-none text-gray-900"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:border-aj-yellow focus:outline-none text-gray-900"
                  placeholder="080xxxxxxxx"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Delivery Address</label>
              <textarea
                rows={2}
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-aj-yellow focus:outline-none resize-none text-gray-900"
                placeholder="Room/house number, street, landmark..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Cluster <span className="text-gray-400 font-normal text-xs">(determines delivery fee)</span>
              </label>
              <div className="relative">
                <select
                  value={form.cluster_id}
                  onChange={e => setForm(f => ({ ...f, cluster_id: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-aj-yellow focus:outline-none text-gray-900 bg-white appearance-none"
                >
                  <option value="">No cluster selected</option>
                  {clusters.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — ₦{Number(c.delivery_fee).toLocaleString()} delivery
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {selectedCluster && (
                <p className="text-xs text-gray-500 mt-1">{selectedCluster.location}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-aj-yellow to-orange-400 text-aj-dark py-3 rounded-xl font-bold hover:from-yellow-400 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-aj-dark" /> Saving...</> : <><CheckCircle className="w-4 h-4" /> Save Changes</>}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <Lock className="w-5 h-5 text-aj-yellow" /> Change Password
          </h2>

          {pwMessage && (
            <div className={`mb-4 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold ${
              pwMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {pwMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {pwMessage.text}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={pwForm.old_password}
                onChange={e => setPwForm(f => ({ ...f, old_password: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-aj-yellow focus:outline-none text-gray-900"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={pwForm.new_password}
                onChange={e => setPwForm(f => ({ ...f, new_password: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-aj-yellow focus:outline-none text-gray-900"
                placeholder="At least 8 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={pwForm.confirm}
                onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-aj-yellow focus:outline-none text-gray-900"
                placeholder="Repeat new password"
              />
            </div>
            <button
              type="submit"
              disabled={pwLoading}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {pwLoading ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Updating...</> : <><Lock className="w-4 h-4" /> Update Password</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
