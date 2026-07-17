'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Clock, Users, UtensilsCrossed, Package } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Navbar from '@/components/Navbar'

interface ComboItem {
  id: number
  product_name: string
  product_unit: string
  quantity_text: string
  notes: string
}

interface MealSuggestion {
  id: number
  meal_name: string
  frequency: string
}

interface ComboDetail {
  id: number
  name: string
  slug: string
  description: string
  price: number
  feeds: string
  duration: string
  meals_count: number
  use_case: string
  use_case_display: string
  badge: string | null
  badge_display: string | null
  cost_per_meal: number
  savings_estimate: number
  item_count: number
  items: ComboItem[]
  meal_suggestions: MealSuggestion[]
}

const badgeGradients: Record<string, string> = {
  popular: 'from-orange-400 to-red-500',
  value: 'from-green-400 to-emerald-500',
  premium: 'from-purple-400 to-indigo-500',
  new: 'from-blue-400 to-cyan-500',
  limited: 'from-pink-400 to-rose-500',
}

const useCaseEmoji: Record<string, string> = {
  students: '🎓',
  families: '👨‍👩‍👧‍👦',
  shared: '🏠',
  events: '🎉',
}

export default function ComboDetailPage({ params }: { params: { slug: string } }) {
  const [combo, setCombo] = useState<ComboDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addItem, itemCount } = useCart()

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const handleAddToCart = () => {
    if (!combo) return
    addItem({
      id: `combo-${combo.id}`,
      name: combo.name,
      price: Number(combo.price),
      type: 'combo',
      slug: combo.slug,
    })
  }

  useEffect(() => {
    fetchCombo()
  }, [params.slug])

  const fetchCombo = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/api/products/combos/${params.slug}/`)
      if (!res.ok) {
        setError('Combo not found')
        return
      }
      const data = await res.json()
      setCombo(data)
    } catch (err) {
      setError('Failed to load combo details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aj-yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading combo details...</p>
        </div>
      </div>
    )
  }

  if (error || !combo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-8xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Combo not found'}</h2>
          <Link href="/products" className="text-aj-yellow hover:underline font-semibold">
            ← Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const gradient = combo.badge ? badgeGradients[combo.badge] : 'from-gray-400 to-gray-500'
  const emoji = useCaseEmoji[combo.use_case] || '🍱'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        links={[
          { href: '/products', label: 'Products' },
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/ai-planner', label: 'AI Planner' },
        ]}
        rightSlot={
          <Link href="/products" className="bg-aj-yellow text-aj-dark px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-yellow-400 transition">
            Cart ({itemCount})
          </Link>
        }
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-aj-yellow mb-6 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className={`bg-gradient-to-br ${gradient} h-64 flex items-center justify-center relative`}>
            <span className="text-9xl">{emoji}</span>
            {combo.badge_display && (
              <div className="absolute top-6 right-6 bg-white text-gray-800 px-4 py-2 rounded-full font-bold shadow-lg text-sm">
                {combo.badge_display}
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-6">
              <h1 className="text-3xl font-bold text-white">{combo.name}</h1>
              <p className="text-white/90 mt-1">{combo.description}</p>
            </div>
          </div>

          <div className="p-4 sm:p-8">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center bg-gray-50 rounded-xl p-4">
                <Users className="w-6 h-6 text-aj-yellow mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900">{combo.feeds}</p>
                <p className="text-sm text-gray-600">Feeds</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-4">
                <Clock className="w-6 h-6 text-aj-yellow mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900">{combo.duration}</p>
                <p className="text-sm text-gray-600">Duration</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-4">
                <UtensilsCrossed className="w-6 h-6 text-aj-yellow mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900">{combo.meals_count}+</p>
                <p className="text-sm text-gray-600">Meals</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-4">
                <Package className="w-6 h-6 text-aj-yellow mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900">{combo.item_count}</p>
                <p className="text-sm text-gray-600">Ingredients</p>
              </div>
            </div>

            {/* Price & Savings */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-4xl font-bold text-gray-900">
                    ₦{Number(combo.price).toLocaleString()}
                  </p>
                  <p className="text-gray-600 mt-1">
                    Just ₦{Number(combo.cost_per_meal).toLocaleString(undefined, { maximumFractionDigits: 0 })} per meal
                  </p>
                </div>
                <div className="bg-green-500 text-white px-6 py-3 rounded-xl text-center">
                  <p className="text-2xl font-bold">
                    Save ₦{Number(combo.savings_estimate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-sm text-green-100">vs buying individually</p>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-aj-yellow to-orange-400 text-aj-dark py-4 rounded-2xl font-bold text-xl hover:from-yellow-400 hover:to-orange-500 transition flex items-center justify-center gap-3"
            >
              <ShoppingCart className="w-6 h-6" />
              Add to Cart — ₦{Number(combo.price).toLocaleString()}
            </button>
            <p className="text-center text-sm text-gray-500 mt-3">
              Free delivery for orders above cluster minimum
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Ingredients List */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-aj-yellow" />
              What's Included
            </h2>
            {combo.items.length > 0 ? (
              <ul className="space-y-3">
                {combo.items.map(item => (
                  <li key={item.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-aj-yellow rounded-full w-6 h-6 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-aj-dark">✓</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">{item.quantity_text}</span>
                      {' '}
                      <span className="text-gray-700">{item.product_name}</span>
                      {item.notes && (
                        <p className="text-sm text-gray-500 mt-0.5">{item.notes}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Ingredient details coming soon.</p>
            )}
          </div>

          {/* Meal Suggestions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-aj-yellow" />
              Meals You Can Cook
            </h2>
            {combo.meal_suggestions.length > 0 ? (
              <ul className="space-y-4">
                {combo.meal_suggestions.map(meal => (
                  <li key={meal.id} className="flex items-center justify-between bg-orange-50 rounded-xl px-4 py-3">
                    <span className="font-semibold text-gray-900">{meal.meal_name}</span>
                    <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-orange-200">
                      {meal.frequency}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Meal suggestions coming soon.</p>
            )}

            {/* Use Case Badge */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600 mb-2">Perfect for:</p>
              <span className="inline-flex items-center gap-2 bg-aj-yellow text-aj-dark px-4 py-2 rounded-full font-semibold text-sm">
                {useCaseEmoji[combo.use_case]} {combo.use_case_display}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 bg-gradient-to-br from-aj-yellow to-orange-400 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-aj-dark mb-2">Ready to start saving?</h3>
          <p className="text-aj-dark/80 mb-6">
            Join your cluster and get this bundle at the best wholesale price.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleAddToCart}
              className="bg-aj-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <Link href="/products" className="bg-white text-aj-dark px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition text-center">
              Browse More Combos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
