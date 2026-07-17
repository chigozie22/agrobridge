'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Package, Thermometer, Clock, Tag, Store } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Navbar from '@/components/Navbar'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const PRODUCT_IMAGES: Record<string, string> = {
  'Milo':                      '/images/products/milo.jpg',
  'Peak Milk':                 '/images/products/peak_milk.jpg',
  'Cornflakes':                '/images/products/cornflakes.jpg',
  'Golden Morn':               '/images/products/golden_morn.jpg',
  'Garri':                     '/images/products/garri.jpg',
  'Brown Beans':               '/images/products/brown_beans.jpg',
  'Sugar':                     '/images/products/sugar.jpg',
  'Gino Tomato Paste':         '/images/products/gino.jpg',
  'Crayfish':                  '/images/products/crayfish.jpg',
  'Curry Powder':              '/images/products/curry_powder.jpg',
  'Ripe Plantain':             '/images/products/ripe_plantain.jpg',
  'Frozen Fish':               '/images/products/frozen-fish.jpg',
  'Maggi/Knorr Seasoning':     '/images/products/spices.jpg',
  'White Yam':                 '/images/products/yam.jpg',
  'Yam':                       '/images/products/yam.jpg',
  'Fresh Cow Milk':            'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=300&q=80',
  'Yogurt':                    'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80',
  'Butter':                    'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=300&q=80',
  'Cheese':                    'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=300&q=80',
  'Broiler Chicken':           '/images/products/broiler_chicken.jpg',
  'Chicken Parts':             '/images/products/chicken_parts.jpg',
  'Smoked Chicken':            '/images/products/smoked_chicken.jpg',
  'Turkey':                    '/images/products/turkey.jpg',
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const { addItem, itemCount } = useCart()

  useEffect(() => { fetchProduct() }, [params.id])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/${params.id}/`)
      if (!res.ok) return
      setProduct(await res.json())
    } catch {}
    finally { setLoading(false) }
  }

  const handleAddToCart = (price: number) => {
    if (!product) return
    addItem({
      id: `product-${product.id}`,
      name: product.name,
      price,
      type: 'product',
      unit: product.unit,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const cheapestPrice = product?.vendor_prices
    ?.filter((vp: any) => vp.is_available)
    .reduce((min: number, vp: any) => Math.min(min, Number(vp.price)), Infinity)

  const imgSrc = product?.image || PRODUCT_IMAGES[product?.name] ||
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aj-yellow" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-7xl mb-4">🥗</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <Link href="/products" className="text-aj-yellow hover:underline font-semibold">← Back to Products</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        links={[
          { href: '/products', label: 'Products' },
          { href: '/ai-planner', label: 'AI Planner' },
        ]}
        rightSlot={
          <Link href="/products" className="bg-aj-yellow text-aj-dark px-4 py-2 rounded-lg font-bold text-sm">
            🛒 Cart ({itemCount})
          </Link>
        }
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-aj-yellow mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Image */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
            <div className="h-72 md:h-96">
              <img
                src={imgSrc}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs bg-aj-yellow text-aj-dark px-3 py-1 rounded-full font-bold">
                {product.category_name}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-3 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-aj-yellow" />
                  <div>
                    <p className="text-xs text-gray-500">Unit</p>
                    <p className="text-sm font-bold text-gray-900">per {product.unit}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-aj-yellow" />
                  <div>
                    <p className="text-xs text-gray-500">Shelf life</p>
                    <p className="text-sm font-bold text-gray-900">{product.shelf_life_days} days</p>
                  </div>
                </div>
                {product.requires_refrigeration && (
                  <div className="col-span-2 bg-blue-50 rounded-xl p-3 flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-blue-500" />
                    <p className="text-sm font-semibold text-blue-700">Requires refrigeration</p>
                  </div>
                )}
              </div>

              {cheapestPrice && cheapestPrice !== Infinity && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 mb-6">
                  <p className="text-3xl font-bold text-gray-900">₦{cheapestPrice.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">best price per {product.unit} via AgroBridge</p>
                </div>
              )}
            </div>

            {cheapestPrice && cheapestPrice !== Infinity ? (
              <button
                onClick={() => handleAddToCart(cheapestPrice)}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition flex items-center justify-center gap-3 ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-aj-yellow to-orange-400 text-aj-dark hover:from-yellow-400'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {added ? '✓ Added to Cart!' : `Add to Cart — ₦${cheapestPrice.toLocaleString()}`}
              </button>
            ) : (
              <div className="w-full py-4 rounded-2xl bg-gray-100 text-gray-500 font-bold text-center">
                Not available right now
              </div>
            )}
          </div>
        </div>

        {/* Vendor prices */}
        {product.vendor_prices?.filter((vp: any) => vp.is_available).length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Store className="w-5 h-5 text-aj-yellow" /> Available from {product.vendor_prices.filter((vp: any) => vp.is_available).length} vendor{product.vendor_prices.filter((vp: any) => vp.is_available).length !== 1 ? 's' : ''}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.vendor_prices
                .filter((vp: any) => vp.is_available)
                .sort((a: any, b: any) => Number(a.price) - Number(b.price))
                .map((vp: any) => (
                  <div key={vp.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-aj-yellow transition">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-gray-900 text-sm">{vp.vendor_name}</p>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{vp.vendor_type}</span>
                    </div>
                    <p className="text-xl font-bold text-aj-yellow">₦{Number(vp.price).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Min: {vp.min_quantity} {product.unit} · Stock: {vp.stock_quantity}
                    </p>
                    <button
                      onClick={() => handleAddToCart(Number(vp.price))}
                      className="w-full mt-3 bg-aj-yellow text-aj-dark py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition"
                    >
                      Add at ₦{Number(vp.price).toLocaleString()}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
