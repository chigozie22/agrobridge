'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, TrendingUp, Users } from 'lucide-react'

interface Category {
  id: number
  name: string
  icon: string
  description: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  // Category color scheme (PricePally style)
  const categoryColors = [
    'from-green-100 to-green-200 border-green-300 hover:from-green-200 hover:to-green-300',
    'from-blue-100 to-blue-200 border-blue-300 hover:from-blue-200 hover:to-blue-300',
    'from-yellow-100 to-yellow-200 border-yellow-300 hover:from-yellow-200 hover:to-yellow-300',
    'from-pink-100 to-pink-200 border-pink-300 hover:from-pink-200 hover:to-pink-300',
    'from-purple-100 to-purple-200 border-purple-300 hover:from-purple-200 hover:to-purple-300',
    'from-orange-100 to-orange-200 border-orange-300 hover:from-orange-200 hover:to-orange-300',
    'from-red-100 to-red-200 border-red-300 hover:from-red-200 hover:to-red-300',
  ]

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  useEffect(() => {
    if (selectedCategory !== 'all') {
      fetchProducts()
    }
  }, [selectedCategory])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/categories/`)
      const data = await response.json()
      setCategories(data.results || data)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      let url = `${API_URL}/api/products/`
      
      if (selectedCategory !== 'all') {
        url += `?category=${selectedCategory}`
      }
      
      const response = await fetch(url)
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
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
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
              <Link href="/products" className="text-aj-yellow font-semibold">
                Products
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-aj-yellow transition">
                Dashboard
              </Link>
              <div className="bg-aj-yellow text-aj-dark px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-yellow-400 transition">
                Cart (0)
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ============================================ */}
        {/* 1. HERO SECTION                              */}
        {/* ============================================ */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-aj-yellow mb-6 transition">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Feed Your Family for <span className="text-aj-yellow">Less</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Save up to 30% through group buying with your neighbors
            </p>

            {/* Budget Selector */}
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-gray-700 font-semibold self-center mr-2">
                💰 How much do you want to spend?
              </span>
              <button className="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:border-aj-yellow hover:text-aj-yellow transition">
                ₦5,000
              </button>
              <button className="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:border-aj-yellow hover:text-aj-yellow transition">
                ₦10,000
              </button>
              <button className="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:border-aj-yellow hover:text-aj-yellow transition">
                ₦20,000
              </button>
              <button className="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:border-aj-yellow hover:text-aj-yellow transition">
                ₦50,000+
              </button>
              <button className="bg-gradient-to-r from-aj-yellow to-orange-400 text-aj-dark px-6 py-3 rounded-lg font-bold hover:from-yellow-400 hover:to-orange-500 transition">
                Custom Budget
              </button>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* 2. FEATURED COMBOS SECTION                   */}
        {/* ============================================ */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">🍱 Smart Food Bundles</h2>
              <p className="text-gray-600">Pre-planned meals designed for maximum savings</p>
            </div>
            <Link href="#" className="text-aj-yellow hover:underline font-bold flex items-center gap-2">
              See All Combos →
            </Link>
          </div>

          {/* Featured Combo Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Combo 1: Student Survival Pack */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border-2 border-transparent hover:border-aj-yellow">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 h-48 flex items-center justify-center relative">
                <span className="text-8xl">🎓</span>
                <div className="absolute top-4 right-4 bg-white text-aj-yellow px-3 py-1 rounded-full text-sm font-bold">
                  ⭐ Most Popular
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">₦10K Student Survival Pack</h3>
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <span>👤 Feeds: 1 person</span>
                  <span>📅 2 weeks</span>
                  <span>🍽️ 40+ meals</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-green-700 font-semibold">₦250 per meal · Save ₦2,000</p>
                </div>
                <ul className="text-sm text-gray-600 mb-4 space-y-1">
                  <li>✓ Rice, Beans, Garri, Noodles</li>
                  <li>✓ Eggs, Oil, Seasoning</li>
                  <li>✓ Perfect for hostel life</li>
                </ul>
                <button className="w-full bg-aj-yellow text-aj-dark py-3 rounded-lg font-bold hover:bg-yellow-400 transition">
                  View Details →
                </button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  ⭐⭐⭐⭐⭐ 1,234 students bought this
                </p>
              </div>
            </div>

            {/* Combo 2: Family Weekly Bundle */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border-2 border-transparent hover:border-aj-yellow">
              <div className="bg-gradient-to-br from-green-400 to-blue-500 h-48 flex items-center justify-center">
                <span className="text-8xl">👨‍👩‍👧‍👦</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">₦20K Family Weekly Bundle</h3>
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <span>👥 Feeds: 4 people</span>
                  <span>📅 1 week</span>
                  <span>🍽️ 28 meals</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-green-700 font-semibold">₦714 per meal · Save ₦3,500</p>
                </div>
                <ul className="text-sm text-gray-600 mb-4 space-y-1">
                  <li>✓ All staples + proteins</li>
                  <li>✓ Fresh vegetables included</li>
                  <li>✓ Variety for the family</li>
                </ul>
                <button className="w-full bg-aj-yellow text-aj-dark py-3 rounded-lg font-bold hover:bg-yellow-400 transition">
                  View Details →
                </button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  ⭐⭐⭐⭐⭐ 456 families bought this
                </p>
              </div>
            </div>

            {/* Combo 3: Exam Week Quickie */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border-2 border-transparent hover:border-aj-yellow">
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 h-48 flex items-center justify-center relative">
                <span className="text-8xl">⚡</span>
                <div className="absolute top-4 right-4 bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-bold">
                  🔥 Fast Prep
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">₦5K Exam Week Quickie</h3>
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <span>👤 Feeds: 1 person</span>
                  <span>📅 4 days</span>
                  <span>🍽️ 12 meals</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-green-700 font-semibold">₦417 per meal · No cooking stress</p>
                </div>
                <ul className="text-sm text-gray-600 mb-4 space-y-1">
                  <li>✓ Noodles, Bread, Eggs</li>
                  <li>✓ Quick prep meals only</li>
                  <li>✓ Focus on your exams!</li>
                </ul>
                <button className="w-full bg-aj-yellow text-aj-dark py-3 rounded-lg font-bold hover:bg-yellow-400 transition">
                  View Details →
                </button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  ⭐⭐⭐⭐⭐ 789 students bought this
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* 3. SHOP BY CATEGORY SECTION                  */}
        {/* ============================================ */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">🛒 Shop by Category</h2>
              <p className="text-gray-600">Browse individual products or build your own custom order</p>
            </div>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-aj-yellow hover:underline font-bold"
              >
                View All →
              </button>
            )}
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {/* SPECIAL: Food Bundles Category (Always First) */}
            <button
              onClick={() => setSelectedCategory('bundles')}
              className={`p-6 rounded-2xl border-2 transition-all relative overflow-hidden ${
                selectedCategory === 'bundles'
                  ? 'ring-4 ring-aj-yellow shadow-2xl scale-105'
                  : 'shadow-lg hover:shadow-2xl hover:scale-105'
              } bg-gradient-to-br from-yellow-200 via-orange-200 to-yellow-300 border-yellow-400`}
            >
              {/* Sparkle Effect */}
              <div className="absolute top-2 right-2">
                <Sparkles className="w-5 h-5 text-yellow-600 animate-pulse" />
              </div>
              
              {/* Featured Badge */}
              <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                ★ FEATURED
              </div>

              {/* Icon */}
              <div className="text-6xl mb-3 mt-4">🍱</div>

              {/* Name */}
              <h3 className="font-bold text-gray-900 text-lg mb-1">Food Bundles</h3>

              {/* Description */}
              <p className="text-sm text-gray-700 font-medium">Pre-planned meals, max savings</p>
            </button>

            {/* Regular Categories */}
            {categories.map((category: any, index) => {
              const colorClass = categoryColors[index % categoryColors.length]
              const isActive = selectedCategory === category.id.toString()

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id.toString())}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    isActive
                      ? 'ring-4 ring-aj-yellow shadow-2xl scale-105'
                      : 'shadow-lg hover:shadow-2xl hover:scale-105'
                  } bg-gradient-to-br ${colorClass}`}
                >
                  {/* Icon */}
                  <div className="text-6xl mb-3">{category.icon}</div>

                  {/* Name */}
                  <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600">{category.description}</p>
                </button>
              )
            })}
          </div>

          {/* Products Section */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aj-yellow mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : (
            <>
              {/* Section Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'all'
                    ? 'All Products'
                    : selectedCategory === 'bundles'
                    ? 'All Food Bundles'
                    : categories.find((c: any) => c.id.toString() === selectedCategory)?.name}
                </h3>
                <p className="text-gray-600 mt-1">
                  Showing {products.length} products
                  {selectedCategory !== 'all' && ' in this category'}
                </p>
              </div>

              {/* Products Grid */}
              {selectedCategory === 'bundles' ? (
                // Show combo placeholder when Food Bundles selected
                <div className="text-center py-12 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200">
                  <div className="text-8xl mb-4">🍱</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Food Bundles Coming Soon!</h3>
                  <p className="text-gray-600 mb-6">
                    We're preparing amazing combo packages for you.
                    <br />
                    Check out our featured bundles above or browse individual products.
                  </p>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="bg-aj-yellow text-aj-dark px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition"
                  >
                    Browse All Products
                  </button>
                </div>
              ) : products.length > 0 ? (
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-200">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-600 text-lg mb-4">No products available in this category yet.</p>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="bg-aj-yellow text-aj-dark px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
                  >
                    Browse All Products
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ============================================ */}
        {/* 4. WHY CHOOSE AGROBRIDGE SECTION             */}
        {/* ============================================ */}
        <div className="mb-16">
          {/* Features Cards */}
          <div className="text-center mb-12">
            <p className="text-aj-yellow font-semibold text-sm uppercase tracking-wide mb-2">FEATURES</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cool Features to Simplify Your Shopping
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Smart tools designed to make bulk buying easier and more affordable
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Feature 1: Group Buying - Orange/Yellow */}
            <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transition-all">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Cluster Buying</h3>
              <p className="text-white text-opacity-90">
                Join your neighbors to buy in bulk and save 20-30% on every purchase through group buying power.
              </p>
            </div>

            {/* Feature 2: Smart Combos - Yellow/Gold */}
            <div className="bg-gradient-to-br from-aj-yellow via-yellow-400 to-yellow-500 rounded-2xl p-8 text-aj-dark shadow-lg hover:shadow-2xl transition-all">
              <div className="bg-aj-dark bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-aj-dark" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Smart Food Bundles</h3>
              <p className="text-aj-dark text-opacity-90">
                Pre-planned meal packages that solve budgeting and meal planning. Know exactly what you can cook.
              </p>
            </div>

            {/* Feature 3: Flexible Delivery - Green/Yellow */}
            <div className="bg-gradient-to-br from-green-500 via-green-600 to-aj-yellow rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transition-all">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Batch Delivery</h3>
              <p className="text-white text-opacity-90">
                Choose same-day delivery or wait 2-3 days for cluster delivery and save an extra 5-10% on your order.
              </p>
            </div>
          </div>

          {/* Why Choose Section */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl overflow-hidden border-2 border-yellow-200">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: Image */}
              <div className="relative h-full min-h-[400px] bg-gradient-to-br from-aj-yellow to-orange-400 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-9xl mb-4">🚚</div>
                  <div className="bg-white rounded-2xl p-6 shadow-xl">
                    <p className="text-4xl font-bold text-gray-900 mb-2">₦45,000</p>
                    <p className="text-gray-600">Saved by FUTO students<br/>this month</p>
                  </div>
                </div>
              </div>

              {/* Right: Features List */}
              <div className="p-8 md:p-12">
                <p className="text-aj-yellow font-semibold text-sm uppercase tracking-wide mb-2">
                  WHY CHOOSE AGROBRIDGE
                </p>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Your Ultimate Fresh Food Destination
                </h2>

                <div className="space-y-6">
                  {/* Feature 1 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-aj-yellow rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="text-2xl">🛒</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Convenience</h4>
                      <p className="text-gray-600 text-sm">
                        Shop from your hostel or home. No need to trek to Eziobodo market or Relief market.
                      </p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-aj-yellow rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="text-2xl">📦</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Wide Product Range</h4>
                      <p className="text-gray-600 text-sm">
                        From fresh vegetables to grains, cereals, and proteins. Everything you need in one place.
                      </p>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-aj-yellow rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="text-2xl">⭐</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Quality Assurance</h4>
                      <p className="text-gray-600 text-sm">
                        Only verified vendors. Fresh products delivered to your cluster with quality guarantee.
                      </p>
                    </div>
                  </div>

                  {/* Feature 4 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-aj-yellow rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="text-2xl">💰</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Cost Savings</h4>
                      <p className="text-gray-600 text-sm">
                        Save 20-30% through group buying. Lower prices than retail markets, better than individual orders.
                      </p>
                    </div>
                  </div>

                  {/* Feature 5 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-aj-yellow rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="text-2xl">⏱️</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Time Efficiency</h4>
                      <p className="text-gray-600 text-sm">
                        Order in minutes, delivered to your hostel. Focus on your studies, we handle the shopping.
                      </p>
                    </div>
                  </div>

                  {/* Feature 6 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-aj-yellow rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="text-2xl">🚚</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Flexible Delivery</h4>
                      <p className="text-gray-600 text-sm">
                        Same-day, next-day, or cluster batch delivery. Choose what works for your schedule and budget.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* 4. HOW IT WORKS SECTION                      */}
        {/* ============================================ */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 border-2 border-yellow-200">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            How AgroBridge Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-aj-yellow rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-aj-dark" />
              </div>
              <h3 className="font-bold text-xl mb-2">① Join Your Cluster</h3>
              <p className="text-gray-600">
                Sign up and join your neighborhood buying group for better prices
              </p>
            </div>
            <div className="text-center">
              <div className="bg-aj-yellow rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-aj-dark" />
              </div>
              <h3 className="font-bold text-xl mb-2">② Shop Smart</h3>
              <p className="text-gray-600">
                Choose combos or build custom orders. We aggregate all cluster orders
              </p>
            </div>
            <div className="text-center">
              <div className="bg-aj-yellow rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-aj-dark" />
              </div>
              <h3 className="font-bold text-xl mb-2">③ Save Money</h3>
              <p className="text-gray-600">
                Enjoy 20-30% savings through bulk buying power. Everyone wins!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Cart Indicator (Placeholder) */}
      <div className="fixed bottom-6 right-6 bg-white shadow-2xl rounded-2xl p-4 border-2 border-gray-200 max-w-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-gray-900">🛒 Your Cart</span>
          <span className="text-sm text-gray-600">FUTO Main Hostels</span>
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Current:</span>
            <span className="font-bold text-gray-900">₦0 / ₦3,000</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-aj-yellow h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
        <button className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg font-bold cursor-not-allowed">
          Add ₦3,000 to checkout
        </button>
      </div>
    </div>
  )
}

function ProductCard({ product }: any) {
  // Check if item price is below minimum
  const isBelowMinimum = product.cheapest_price < 500

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden ${
      isBelowMinimum ? 'opacity-60' : 'hover:scale-105'
    }`}>
      {/* Product Image */}
      <div className="h-48 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center relative">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl">🥗</span>
        )}
        {isBelowMinimum && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-sm">Below ₦500 Minimum</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category Badge */}
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {product.category_name}
        </span>

        {/* Product Name */}
        <h3 className="font-bold text-lg mt-2 text-gray-900">{product.name}</h3>

        {/* Vendor Count */}
        <p className="text-sm text-gray-600 mt-1">
          {product.vendor_count} vendor{product.vendor_count !== 1 ? 's' : ''}
        </p>

        {/* Price */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className={`text-2xl font-bold ${isBelowMinimum ? 'text-gray-400' : 'text-aj-yellow'}`}>
              ₦{product.cheapest_price?.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">/{product.unit}</span>
          </div>
          <button
            disabled={isBelowMinimum}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              isBelowMinimum
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-aj-yellow text-aj-dark hover:bg-yellow-400'
            }`}
          >
            {isBelowMinimum ? 'Min ₦500' : 'View'}
          </button>
        </div>
      </div>
    </div>
  )
}