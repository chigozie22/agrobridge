'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, TrendingUp, Users, ShoppingCart, Plus, Minus, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface Category {
  id: number
  name: string
  icon: string
  description: string
}

interface Combo {
  id: number
  name: string
  slug: string
  description: string
  price: number
  feeds: string
  duration: string
  meals_count: number
  use_case: string
  badge: string | null
  badge_display: string | null
  is_featured: boolean
  cost_per_meal: number
  savings_estimate: number
  item_count: number
}

// Fallback Unsplash images (food staples, not cooked dishes)
const COMBO_DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'

const CATEGORY_IMAGES: Record<string, string> = {
  'Vegetables':    '/images/products/gino.jpg',
  'Grains':        '/images/products/garri.jpg',
  'Cereals':       '/images/products/cereals.jpg',
  'Tubers':        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80',
  'Fruits':        '/images/products/ripe_plantain.jpg',
  'Protein':       '/images/products/frozen-fish.jpg',
  'Oils & Spices': '/images/products/spices.jpg',
  'Oil & Spices':  '/images/products/spices.jpg',
  'Oils':          '/images/products/spices.jpg',
  'Spices':        '/images/products/spices.jpg',
  'Dairy':         '/images/products/dairy.jpg',
  'Poultry':       '/images/products/poultry.jpg',
}

// ── Individual product images ────────────────────────────────────────────────
const PRODUCT_IMAGES: Record<string, string> = {
  // Local images from public/images/products/
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
  // Unsplash fallbacks for products without local images
  'Indomie Instant Noodles':   'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=300&q=80',
  'Golden Penny Spaghetti':    'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=300&q=80',
  'Eggs':                      'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=300&q=80',
  'Groundnut Oil':             'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80',
  'Palm Oil':                  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80',
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
  'Long Grain Rice':           'https://images.unsplash.com/photo-1536304993881-ff86d42818e8?auto=format&fit=crop&w=300&q=80',
  'Fresh Tomatoes':            'https://images.unsplash.com/photo-1546094096-0df4bcabd337?auto=format&fit=crop&w=300&q=80',
  'Fresh Yam':                 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80',
  'Red Onions':                'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=300&q=80',
  'Red Pepper':                'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?auto=format&fit=crop&w=300&q=80',
}

function getComboImage(comboId: number, localImages: string[]) {
  if (localImages.length > 0) {
    const file = localImages[comboId % localImages.length]
    return `/images/combos/${file}`
  }
  return COMBO_DEFAULT_FALLBACK
}

const CLUSTER_MIN = 3000

export default function ProductsPage() {
  const { items, addItem, removeItem, updateQuantity, total, itemCount } = useCart()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredCombos, setFeaturedCombos] = useState<Combo[]>([])
  const [allCombos, setAllCombos] = useState<Combo[]>([])
  const [comboImages, setComboImages] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedBudget, setSelectedBudget] = useState<number | null>(null)
  const [customBudget, setCustomBudget] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [loading, setLoading] = useState(true)
  const [combosLoading, setCombosLoading] = useState(true)
  const [error, setError] = useState('')
  const [cartOpen, setCartOpen] = useState(false)

  const bundlesSectionRef = useRef<HTMLDivElement>(null)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    fetchCategories()
    fetchProducts()
    fetchFeaturedCombos()
    fetch('/api/combo-images')
      .then(r => r.json())
      .then(d => setComboImages(d.images || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (selectedCategory === 'bundles') {
      fetchAllCombos()
    } else {
      fetchProducts()
    }
  }, [selectedCategory])

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/categories/`)
      const data = await res.json()
      const all: Category[] = data.results || data
      const seen = new Set<string>()
      setCategories(all.filter(c => { if (seen.has(c.name)) return false; seen.add(c.name); return true }))
    } catch {}
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      let url = `${API_URL}/api/products/`
      if (selectedCategory !== 'all' && selectedCategory !== 'bundles') url += `?category=${selectedCategory}`
      const res = await fetch(url)
      const data = await res.json()
      setProducts(data.results || data)
    } catch { setError('Failed to load products') }
    finally { setLoading(false) }
  }

  const fetchFeaturedCombos = async () => {
    try {
      setCombosLoading(true)
      const res = await fetch(`${API_URL}/api/products/combos/featured/`)
      const data = await res.json()
      setFeaturedCombos(data.results || data)
    } catch {}
    finally { setCombosLoading(false) }
  }

  const fetchAllCombos = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/api/products/combos/`)
      const data = await res.json()
      setAllCombos(data.results || data)
    } catch { setError('Failed to load combos') }
    finally { setLoading(false) }
  }

  const handleSeeAllCombos = () => {
    setSelectedCategory('bundles')
    setTimeout(() => bundlesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const BUDGET_OPTIONS = [
    { label: '₦5,000',   value: 5000  },
    { label: '₦10,000',  value: 10000 },
    { label: '₦20,000',  value: 20000 },
    { label: '₦50,000+', value: 50000 },
  ]

  const activeBudget = showCustomInput && customBudget
    ? parseInt(customBudget.replace(/,/g, ''), 10)
    : selectedBudget

  const filteredProducts = activeBudget
    ? products.filter(p => p.cheapest_price <= activeBudget)
    : products

  const filteredFeaturedCombos = activeBudget
    ? featuredCombos.filter(c => Number(c.price) <= activeBudget)
    : featuredCombos

  const filteredAllCombos = activeBudget
    ? allCombos.filter(c => Number(c.price) <= activeBudget)
    : allCombos

  const handleBudgetSelect = (value: number) => {
    setShowCustomInput(false)
    setCustomBudget('')
    setSelectedBudget(prev => prev === value ? null : value)
    setTimeout(() => bundlesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const handleCustomBudget = (val: string) => {
    setCustomBudget(val)
    setSelectedBudget(null)
    if (val) setTimeout(() => bundlesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const progress = Math.min((total / CLUSTER_MIN) * 100, 100)
  const canCheckout = total >= CLUSTER_MIN

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-gray-900">Agro</span><span className="text-aj-yellow">Bridge</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-700 hover:text-aj-yellow transition hidden sm:block">Home</Link>
              <Link href="/products" className="text-aj-yellow font-semibold">Products</Link>
              <Link href="/orders" className="text-gray-700 hover:text-aj-yellow transition hidden sm:block">My Orders</Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-aj-yellow transition hidden sm:block">Dashboard</Link>
              <Link href="/ai-planner" className="text-gray-700 hover:text-aj-yellow transition hidden sm:block">AI Planner</Link>
              <button
                onClick={() => setCartOpen(o => !o)}
                className="relative bg-aj-yellow text-aj-dark px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Cart ({itemCount})
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Cart Drawer ──────────────────────────────────────── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">🛒 Your Cart</h2>
              <button onClick={() => setCartOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-500">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-1">Add combos or products to get started</p>
                </div>
              ) : items.map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="text-aj-yellow font-bold">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-aj-yellow hover:bg-yellow-400 flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeItem(item.id)} className="w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center ml-1">
                      <X className="w-3 h-3 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t bg-white">
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Total: <strong className="text-gray-900">₦{total.toLocaleString()}</strong></span>
                    <span className="text-gray-500">Min: ₦{CLUSTER_MIN.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-aj-yellow h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  {!canCheckout && (
                    <p className="text-xs text-gray-500 mt-1">Add ₦{(CLUSTER_MIN - total).toLocaleString()} more to checkout</p>
                  )}
                </div>
                {canCheckout ? (
                  <Link href="/checkout"
                    className="block w-full py-3 rounded-xl font-bold text-center bg-gradient-to-r from-aj-yellow to-orange-400 text-aj-dark hover:from-yellow-400 transition"
                  >
                    Proceed to Checkout →
                  </Link>
                ) : (
                  <button disabled className="w-full py-3 rounded-xl font-bold bg-gray-200 text-gray-400 cursor-not-allowed">
                    Need ₦{(CLUSTER_MIN - total).toLocaleString()} more
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-aj-yellow mb-6 transition">
            <ArrowLeft className="w-4 h-4" />Back to Home
          </Link>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Feed Your Family for <span className="text-aj-yellow">Less</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">Save up to 30% through group buying with your neighbors</p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-gray-700 font-semibold self-center">💰 Budget:</span>
              {BUDGET_OPTIONS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => handleBudgetSelect(value)}
                  className={`px-5 py-2 rounded-lg font-bold transition text-sm border-2 ${
                    selectedBudget === value && !showCustomInput
                      ? 'bg-aj-yellow border-aj-yellow text-aj-dark'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-aj-yellow hover:text-aj-yellow'
                  }`}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => { setShowCustomInput(s => !s); setSelectedBudget(null) }}
                className={`px-5 py-2 rounded-lg font-bold text-sm border-2 transition ${
                  showCustomInput
                    ? 'bg-aj-yellow border-aj-yellow text-aj-dark'
                    : 'bg-gradient-to-r from-aj-yellow to-orange-400 border-transparent text-aj-dark'
                }`}
              >
                Custom
              </button>
            </div>

            {/* Custom budget input */}
            {showCustomInput && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">₦</span>
                  <input
                    type="number"
                    placeholder="Enter your budget"
                    value={customBudget}
                    onChange={e => handleCustomBudget(e.target.value)}
                    className="pl-8 pr-4 py-2 border-2 border-aj-yellow rounded-lg font-semibold text-gray-900 focus:outline-none w-52"
                    autoFocus
                  />
                </div>
                {customBudget && (
                  <span className="text-sm text-gray-500">
                    Showing items up to ₦{Number(customBudget).toLocaleString()}
                  </span>
                )}
              </div>
            )}

            {/* Active budget label */}
            {activeBudget && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-sm text-gray-600">
                  Showing items within <strong className="text-aj-yellow">₦{activeBudget.toLocaleString()}</strong>
                </span>
                <button
                  onClick={() => { setSelectedBudget(null); setShowCustomInput(false); setCustomBudget('') }}
                  className="text-xs text-red-500 hover:underline font-semibold"
                >
                  Clear ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Featured Combos ───────────────────────────────── */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">🍱 Smart Food Bundles</h2>
              <p className="text-gray-600">Pre-planned meals designed for maximum savings</p>
            </div>
            <button onClick={handleSeeAllCombos} className="text-aj-yellow hover:underline font-bold whitespace-nowrap">
              See All Combos →
            </button>
          </div>

          {combosLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-52 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredFeaturedCombos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeaturedCombos.map(combo => (
                <ComboCard key={combo.id} combo={combo} localImages={comboImages} onAddToCart={addItem} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-200">
              <p className="text-gray-500">No featured combos yet — run <code>seed_combos</code> on the backend.</p>
            </div>
          )}
        </div>

        {/* ── Shop by Category ──────────────────────────────── */}
        <div className="mb-16" ref={bundlesSectionRef} id="shop-section">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">🛒 Shop by Category</h2>
              <p className="text-gray-600">Browse individual products or build your own custom order</p>
            </div>
            {selectedCategory !== 'all' && (
              <button onClick={() => setSelectedCategory('all')} className="text-aj-yellow hover:underline font-bold">
                View All →
              </button>
            )}
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {/* Food Bundles — always first */}
            <button
              onClick={() => setSelectedCategory('bundles')}
              className={`rounded-2xl overflow-hidden border-2 transition-all relative ${
                selectedCategory === 'bundles' ? 'ring-4 ring-aj-yellow shadow-2xl scale-105' : 'shadow-lg hover:shadow-2xl hover:scale-105'
              } border-yellow-400`}
            >
              <div className="relative h-32">
                <img
                  src="/images/products/food_bundle.jpg"
                  alt="Food Bundles"
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
                <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                  ★ FEATURED
                </div>
                <Sparkles className="absolute top-2 right-2 w-4 h-4 text-yellow-300 animate-pulse" />
              </div>
              <div className="bg-gradient-to-br from-yellow-200 to-orange-200 p-3">
                <h3 className="font-bold text-gray-900 text-sm">Food Bundles</h3>
                <p className="text-xs text-gray-700">Max savings</p>
              </div>
            </button>

            {/* Regular Categories */}
            {categories.map(cat => {
              const img = CATEGORY_IMAGES[cat.name]
              const isActive = selectedCategory === cat.id.toString()
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id.toString())}
                  className={`rounded-2xl overflow-hidden border-2 transition-all ${
                    isActive ? 'ring-4 ring-aj-yellow shadow-2xl scale-105' : 'shadow-lg hover:shadow-2xl hover:scale-105'
                  } border-gray-200`}
                >
                  <div className="relative h-32">
                    {img ? (
                      <img src={img} alt={cat.name} className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center text-5xl">${cat.icon}</div>` }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center text-5xl">{cat.icon}</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-white font-bold text-sm drop-shadow">{cat.name}</span>
                  </div>
                  <div className="bg-white p-2">
                    <p className="text-xs text-gray-500 truncate">{cat.description}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Products / Bundles Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aj-yellow mx-auto mb-4" />
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'all' ? 'All Products'
                    : selectedCategory === 'bundles' ? 'All Food Bundles'
                    : categories.find(c => c.id.toString() === selectedCategory)?.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {selectedCategory === 'bundles' ? filteredAllCombos.length : filteredProducts.length}{' '}
                  {selectedCategory === 'bundles' ? 'combo packages' : 'products'}
                  {activeBudget ? ` within ₦${activeBudget.toLocaleString()}` : ''}
                </p>
              </div>

              {selectedCategory === 'bundles' ? (
                filteredAllCombos.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAllCombos.map(combo => (
                      <ComboCard key={combo.id} combo={combo} localImages={comboImages} onAddToCart={addItem} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-200">
                    <div className="text-6xl mb-4">🍱</div>
                    <p className="text-gray-500">No combos found.</p>
                  </div>
                )
              ) : filteredProducts.length > 0 ? (
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product: any) => (
                    <ProductCard key={product.id} product={product} onAddToCart={addItem} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-200">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-500 mb-4">No products in this category yet.</p>
                  <button onClick={() => setSelectedCategory('all')} className="bg-aj-yellow text-aj-dark px-6 py-2 rounded-lg font-semibold">
                    Browse All
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Features ──────────────────────────────────────── */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <p className="text-aj-yellow font-semibold text-sm uppercase tracking-wide mb-2">FEATURES</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Cool Features to Simplify Your Shopping</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 rounded-2xl p-8 text-white shadow-lg">
              <div className="bg-white/20 rounded-full w-14 h-14 flex items-center justify-center mb-4"><Users className="w-7 h-7 text-white" /></div>
              <h3 className="text-xl font-bold mb-2">Cluster Buying</h3>
              <p className="text-white/90 text-sm">Join your neighbors to buy in bulk and save 20-30% on every purchase.</p>
            </div>
            <div className="bg-gradient-to-br from-aj-yellow via-yellow-400 to-yellow-500 rounded-2xl p-8 text-aj-dark shadow-lg">
              <div className="bg-aj-dark/10 rounded-full w-14 h-14 flex items-center justify-center mb-4"><Sparkles className="w-7 h-7 text-aj-dark" /></div>
              <h3 className="text-xl font-bold mb-2">Smart Food Bundles</h3>
              <p className="text-aj-dark/90 text-sm">Pre-planned meal packages that solve budgeting and meal planning.</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 via-green-600 to-aj-yellow rounded-2xl p-8 text-white shadow-lg">
              <div className="bg-white/20 rounded-full w-14 h-14 flex items-center justify-center mb-4"><TrendingUp className="w-7 h-7 text-white" /></div>
              <h3 className="text-xl font-bold mb-2">Batch Delivery</h3>
              <p className="text-white/90 text-sm">Choose same-day or cluster batch delivery to save an extra 5-10%.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl overflow-hidden border-2 border-yellow-200">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative h-80 md:h-full min-h-[320px]">
                <img
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80"
                  alt="Fresh food delivery"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-aj-yellow/60 to-transparent flex items-center justify-center">
                  <div className="bg-white rounded-2xl p-5 shadow-xl m-6">
                    <p className="text-3xl font-bold text-gray-900 mb-1">₦45,000</p>
                    <p className="text-gray-600 text-sm">Saved by FUTO students<br />this month</p>
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-12">
                <p className="text-aj-yellow font-semibold text-xs uppercase tracking-wide mb-2">WHY CHOOSE AGROBRIDGE</p>
                <h2 className="text-2xl font-bold text-gray-900 mb-5">Your Ultimate Fresh Food Destination</h2>
                <div className="space-y-4">
                  {[
                    ['🛒', 'Convenience', 'Shop from your hostel or home. No market trips needed.'],
                    ['📦', 'Wide Product Range', 'Vegetables, grains, cereals, proteins — everything in one place.'],
                    ['⭐', 'Quality Assurance', 'Only verified vendors with fresh products delivered to your cluster.'],
                    ['💰', 'Cost Savings', 'Save 20-30% through group buying. Lower than retail markets.'],
                    ['⏱️', 'Time Efficiency', 'Order in minutes. Focus on your studies, we handle the shopping.'],
                    ['🚚', 'Flexible Delivery', 'Same-day or cluster batch delivery — choose your schedule.'],
                  ].map(([emoji, title, desc]) => (
                    <div key={title} className="flex gap-3">
                      <div className="flex-shrink-0 bg-aj-yellow rounded-full w-10 h-10 flex items-center justify-center text-lg">{emoji}</div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
                        <p className="text-gray-500 text-xs">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── How It Works ──────────────────────────────────── */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 border-2 border-yellow-200">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How AgroBridge Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Users className="w-7 h-7 text-aj-dark" />, step: '① Join Your Cluster', desc: 'Sign up and join your neighborhood buying group for better prices' },
              { icon: <Sparkles className="w-7 h-7 text-aj-dark" />, step: '② Shop Smart', desc: 'Choose combos or build custom orders. We aggregate all cluster orders' },
              { icon: <TrendingUp className="w-7 h-7 text-aj-dark" />, step: '③ Save Money', desc: 'Enjoy 20-30% savings through bulk buying power. Everyone wins!' },
            ].map(({ icon, step, desc }) => (
              <div key={step} className="text-center">
                <div className="bg-aj-yellow rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">{icon}</div>
                <h3 className="font-bold text-lg mb-2">{step}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky Cart Bar (bottom) ──────────────────────── */}
      {itemCount > 0 && !cartOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
          <div className="bg-white shadow-2xl rounded-2xl p-4 border-2 border-aj-yellow">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-900">🛒 {itemCount} item{itemCount !== 1 ? 's' : ''}</span>
              <span className="font-bold text-aj-yellow text-lg">₦{total.toLocaleString()}</span>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress to minimum</span>
                <span>₦{total.toLocaleString()} / ₦{CLUSTER_MIN.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-aj-yellow h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
            {canCheckout ? (
              <Link href="/checkout"
                className="block w-full py-2.5 rounded-xl font-bold transition text-sm text-center bg-gradient-to-r from-aj-yellow to-orange-400 text-aj-dark hover:from-yellow-400"
              >
                Checkout →
              </Link>
            ) : (
              <button
                onClick={() => setCartOpen(true)}
                className="w-full py-2.5 rounded-xl font-bold transition text-sm bg-gray-100 text-gray-600"
              >
                Add ₦{(CLUSTER_MIN - total).toLocaleString()} more to unlock checkout
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Combo Card ──────────────────────────────────────────────────────────────
function ComboCard({ combo, localImages, onAddToCart }: {
  combo: Combo
  localImages: string[]
  onAddToCart: (item: any) => void
}) {
  const imgSrc = getComboImage(combo.id, localImages)

  const badgeColor: Record<string, string> = {
    popular: 'bg-orange-500',
    value:   'bg-green-500',
    premium: 'bg-purple-600',
    new:     'bg-blue-500',
    limited: 'bg-pink-500',
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group border-2 border-transparent hover:border-aj-yellow">
      {/* Clickable image + title area */}
      <Link href={`/products/combos/${combo.slug}`} className="block">
        <div className="relative h-52 overflow-hidden">
          <img
            src={imgSrc}
            alt={combo.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => { (e.target as HTMLImageElement).src = COMBO_DEFAULT_FALLBACK }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          {combo.badge_display && (
            <span className={`absolute top-3 right-3 ${badgeColor[combo.badge!] || 'bg-gray-600'} text-white px-3 py-1 rounded-full text-xs font-bold`}>
              {combo.badge_display}
            </span>
          )}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-bold text-lg leading-tight drop-shadow">{combo.name}</h3>
          </div>
        </div>
      </Link>

      <div className="p-5">
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{combo.description}</p>
        <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
          <span className="bg-gray-100 px-2 py-1 rounded-full">👤 {combo.feeds}</span>
          <span className="bg-gray-100 px-2 py-1 rounded-full">📅 {combo.duration}</span>
          <span className="bg-gray-100 px-2 py-1 rounded-full">🍽️ {combo.meals_count}+ meals</span>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 mb-4">
          <p className="text-green-700 font-semibold text-sm">
            ₦{Number(combo.cost_per_meal).toLocaleString(undefined, { maximumFractionDigits: 0 })} / meal
            {' · '}Save ₦{Number(combo.savings_estimate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart({
              id: `combo-${combo.id}`,
              name: combo.name,
              price: Number(combo.price),
              type: 'combo',
              slug: combo.slug,
              image: imgSrc,
            })}
            className="flex-1 bg-aj-yellow text-aj-dark py-2.5 rounded-lg font-bold hover:bg-yellow-400 transition text-sm flex items-center justify-center gap-1"
          >
            <ShoppingCart className="w-4 h-4" /> Add to Cart
          </button>
          <Link
            href={`/products/combos/${combo.slug}`}
            className="px-4 py-2.5 border-2 border-aj-yellow text-aj-yellow rounded-lg font-bold hover:bg-aj-yellow hover:text-aj-dark transition text-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart }: { product: any; onAddToCart: (item: any) => void }) {
  const isBelowMin = product.cheapest_price < 500
  const imgSrc = product.image || PRODUCT_IMAGES[product.name as string]

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden ${isBelowMin ? 'opacity-60' : 'hover:scale-105'}`}>
      <Link href={`/products/${product.id}`} className="block group">
        <div className="h-44 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center relative overflow-hidden">
          {imgSrc
            ? <img src={imgSrc} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            : <span className="text-6xl">🥗</span>
          }
          {isBelowMin && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-xs">Below ₦500 Min</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{product.category_name}</span>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold mt-1.5 text-gray-900 leading-tight hover:text-aj-yellow transition-colors">{product.name}</h3>
        </Link>
        <p className="text-xs text-gray-500 mt-0.5">{product.vendor_count} vendor{product.vendor_count !== 1 ? 's' : ''}</p>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className={`text-xl font-bold ${isBelowMin ? 'text-gray-400' : 'text-aj-yellow'}`}>
              ₦{product.cheapest_price?.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">/{product.unit}</span>
          </div>
          <button
            disabled={isBelowMin}
            onClick={() => !isBelowMin && onAddToCart({
              id: `product-${product.id}`,
              name: product.name,
              price: Number(product.cheapest_price),
              type: 'product',
              unit: product.unit,
            })}
            className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition flex items-center gap-1 ${
              isBelowMin ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-aj-yellow text-aj-dark hover:bg-yellow-400'
            }`}
          >
            {isBelowMin ? 'Min ₦500' : <><Plus className="w-3 h-3" /> Add</>}
          </button>
        </div>
      </div>
    </div>
  )
}
