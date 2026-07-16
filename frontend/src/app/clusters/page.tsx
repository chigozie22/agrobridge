'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Users, Truck, ArrowRight } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function ClustersPage() {
  const [clusters, setClusters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/clusters/`)
      .then(r => r.json())
      .then(d => setClusters(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-gray-900">Agro</span><span className="text-aj-yellow">Bridge</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/products" className="text-gray-700 hover:text-aj-yellow text-sm font-semibold transition">Products</Link>
            <Link href="/poultry-services" className="text-gray-700 hover:text-aj-yellow text-sm font-semibold transition">Poultry Services</Link>
            <Link href="/ai-planner" className="text-gray-700 hover:text-aj-yellow text-sm font-semibold transition">AI Planner</Link>
            <Link href="/login" className="text-gray-700 hover:text-aj-yellow text-sm font-semibold transition">Login</Link>
            <Link href="/signup" className="bg-aj-yellow text-gray-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-aj-green to-green-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6 text-sm font-semibold">
            <MapPin className="w-4 h-4 text-aj-yellow" /> Owerri Buying Groups
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Cluster</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Pool your orders with neighbours in your area. The more people in your cluster, the lower everyone pays.
          </p>
        </div>
      </section>

      {/* Clusters grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aj-yellow" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clusters.map((cluster, i) => (
              <div key={cluster.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-aj-yellow to-orange-400 rounded-xl flex items-center justify-center text-gray-900 font-bold text-lg">
                    {i + 1}
                  </div>
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">ACTIVE</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{cluster.name}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                  <MapPin className="w-3.5 h-3.5" /> {cluster.location}
                </div>
                {cluster.description && (
                  <p className="text-gray-600 text-sm mb-4">{cluster.description}</p>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Truck className="w-4 h-4 text-aj-yellow" />
                    <span className="font-semibold">₦{Number(cluster.delivery_fee).toLocaleString()}</span>
                    <span className="text-gray-400">delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{cluster.total_users || 0} members</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-aj-yellow to-orange-400 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Start Saving?</h2>
          <p className="text-gray-800 mb-6">Sign up and select your cluster to unlock group buying prices.</p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-700 transition">
            Join Your Cluster <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
