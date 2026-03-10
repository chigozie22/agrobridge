'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/`)
      const data = await response.json()
      setProducts(data.results || data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load products')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-gray-900">Agro</span>
              <span className="text-aj-yellow">Bridge</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-700 hover:text-aj-yellow transition">
                Home
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-aj-yellow transition">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-aj-yellow mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Products</h1>
          <p className="text-gray-600">Fresh products from verified vendors at the best prices</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aj-yellow mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            <div className="mb-6 text-gray-600">
              Showing {products.length} products
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No products available at the moment.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product }: any) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer">
      {/* Product Image */}
      <div className="h-48 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <span className="text-6xl">🥗</span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category Badge */}
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {product.category_name}
        </span>

        {/* Product Name */}
        <h3 className="font-bold text-lg mt-2 text-gray-900">
          {product.name}
        </h3>

        {/* Vendor Count */}
        <p className="text-sm text-gray-600 mt-1">
          {product.vendor_count} vendor{product.vendor_count !== 1 ? 's' : ''}
        </p>

        {/* Price */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-2xl font-bold text-aj-yellow">
              ₦{product.cheapest_price?.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">/{product.unit}</span>
          </div>
          <button className="bg-aj-yellow text-aj-dark px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition">
            View
          </button>
        </div>
      </div>
    </div>
  )
}