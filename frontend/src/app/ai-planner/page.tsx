'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Sparkles, ChefHat, ShoppingBasket, Wallet, Clock, Lightbulb,
  AlertCircle, RotateCcw, ArrowRight, Loader2,
} from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const OCCASIONS = [
  { value: 'FAMILY', label: 'Family Meal' },
  { value: 'PARTY', label: 'Birthday / Party' },
  { value: 'RESTAURANT', label: 'Restaurant Menu' },
  { value: 'OTHER', label: 'Custom' },
]

const LOADING_MESSAGES = [
  'Checking real AgroBridge market prices...',
  'Working out quantities for your group size...',
  'Writing the prep and cooking steps...',
  'Balancing your budget...',
  'Almost done plating this up...',
]

interface ShoppingItem {
  item: string
  quantity: string
  unit: string
  estimated_price_naira: number
  category: string
}

interface Recipe {
  dish_name: string
  description: string
  prep_time_minutes: number
  cook_time_minutes: number
  ingredients: string[]
  steps: string[]
}

interface Plan {
  plan_title: string
  summary: string
  people_count: number
  occasion: string
  estimated_total_cost_naira: number
  cost_per_person_naira: number
  shopping_list: ShoppingItem[]
  recipes: Recipe[]
  cooking_tips: string[]
  budget_notes: string
}

export default function AIPlannerPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    occasion: 'FAMILY',
    people_count: '7',
    budget_naira: '',
    dietary_notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0])
  const [error, setError] = useState('')
  const [plan, setPlan] = useState<Plan | null>(null)
  const messageIndex = useRef(0)

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    if (!loading) return
    messageIndex.current = 0
    setLoadingMessage(LOADING_MESSAGES[0])
    const interval = setInterval(() => {
      messageIndex.current = (messageIndex.current + 1) % LOADING_MESSAGES.length
      setLoadingMessage(LOADING_MESSAGES[messageIndex.current])
    }, 2500)
    return () => clearInterval(interval)
  }, [loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const token = localStorage.getItem('accessToken')
    if (!token) { router.push('/login'); return }

    const peopleCount = parseInt(form.people_count, 10)
    if (!peopleCount || peopleCount < 1) {
      setError('Please enter how many people you\'re feeding.')
      return
    }

    setLoading(true)
    setPlan(null)

    try {
      const res = await fetch(`${API_URL}/api/planner/generate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          occasion: form.occasion,
          people_count: peopleCount,
          budget_naira: form.budget_naira ? Number(form.budget_naira) : null,
          dietary_notes: form.dietary_notes,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setError(err.error || err.detail || 'Could not generate a plan. Please try again.')
        return
      }

      const data: Plan = await res.json()
      setPlan(data)
    } catch {
      setError('Something went wrong reaching the AI planner. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const startOver = () => {
    setPlan(null)
    setError('')
  }

  const totalByCategory = plan?.shopping_list.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    const key = item.category || 'Other'
    acc[key] = acc[key] || []
    acc[key].push(item)
    return acc
  }, {}) ?? {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-gray-900">Agro</span><span className="text-aj-yellow">Bridge</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-700 hover:text-aj-yellow transition hidden sm:block">Home</Link>
              <Link href="/products" className="text-gray-700 hover:text-aj-yellow transition hidden sm:block">Products</Link>
              <Link href="/orders" className="text-gray-700 hover:text-aj-yellow transition hidden sm:block">My Orders</Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-aj-yellow transition hidden sm:block">Dashboard</Link>
              <Link href="/ai-planner" className="text-aj-yellow font-semibold">AI Planner</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Hero + explainer */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-aj-yellow border border-yellow-200 rounded-full px-3 py-1 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> NEW — AI FOOD PLANNING ENGINE
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Tell us who you're feeding. We'll plan the rest.
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed">
            This is the first version of AgroBridge's AI demand-planning engine. Describe what you need —
            feeding a family of 7, a birthday party for 100 guests, a restaurant's weekly menu, or anything
            in between — and it generates a full shopping list, step-by-step prep and cooking guide, and a
            realistic Naira budget, grounded in real AgroBridge catalog prices. We're starting simple; smarter
            demand forecasting and automated pricing are coming next.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {!plan && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">What are you planning for?</label>
                <select
                  value={form.occasion}
                  onChange={e => setForm(f => ({ ...f, occasion: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-aj-yellow focus:outline-none text-gray-900"
                >
                  {OCCASIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of people</label>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  required
                  value={form.people_count}
                  onChange={e => setForm(f => ({ ...f, people_count: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-aj-yellow focus:outline-none text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Budget in Naira <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₦</span>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 50,000"
                  value={form.budget_naira}
                  onChange={e => setForm(f => ({ ...f, budget_naira: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl pl-9 pr-4 py-3 focus:border-aj-yellow focus:outline-none text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Anything else we should know? <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="e.g. no pork, mostly rice dishes, must include a soup, vegetarian guests..."
                value={form.dietary_notes}
                onChange={e => setForm(f => ({ ...f, dietary_notes: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-aj-yellow focus:outline-none resize-none text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-aj-yellow to-orange-400 text-aj-dark py-4 rounded-2xl font-bold text-lg hover:from-yellow-400 hover:to-orange-500 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {loadingMessage}</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Generate My Plan</>
              )}
            </button>
          </form>
        )}

        {plan && (
          <div className="space-y-6">
            {/* Title + summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.plan_title}</h2>
              <p className="text-gray-600 leading-relaxed">{plan.summary}</p>
            </div>

            {/* Cost summary */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
                <div className="bg-yellow-50 p-3 rounded-xl"><Wallet className="w-5 h-5 text-aj-yellow" /></div>
                <div>
                  <p className="text-xs text-gray-500">Estimated total</p>
                  <p className="text-lg font-bold text-gray-900">₦{plan.estimated_total_cost_naira.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
                <div className="bg-green-50 p-3 rounded-xl"><Wallet className="w-5 h-5 text-aj-green" /></div>
                <div>
                  <p className="text-xs text-gray-500">Cost per person</p>
                  <p className="text-lg font-bold text-gray-900">₦{plan.cost_per_person_naira.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
                <div className="bg-orange-50 p-3 rounded-xl"><ChefHat className="w-5 h-5 text-orange-500" /></div>
                <div>
                  <p className="text-xs text-gray-500">Feeding</p>
                  <p className="text-lg font-bold text-gray-900">{plan.people_count} people</p>
                </div>
              </div>
            </div>

            {plan.budget_notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-aj-yellow flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{plan.budget_notes}</p>
              </div>
            )}

            {/* Shopping list */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingBasket className="w-5 h-5 text-aj-yellow" /> Shopping List
              </h3>
              <div className="space-y-5">
                {Object.entries(totalByCategory).map(([category, items]) => (
                  <div key={category}>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">{category}</p>
                    <div className="divide-y divide-gray-100">
                      {items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-2 gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{item.item}</p>
                            <p className="text-xs text-gray-500">{item.quantity} {item.unit}</p>
                          </div>
                          <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                            ₦{item.estimated_price_naira.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 bg-aj-yellow text-aj-dark px-5 py-2.5 rounded-xl font-bold hover:bg-yellow-400 transition"
              >
                Shop these ingredients <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Recipes */}
            <div className="space-y-4">
              {plan.recipes.map((recipe, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <ChefHat className="w-5 h-5 text-aj-yellow flex-shrink-0" /> {recipe.dish_name}
                    </h3>
                    <span className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap mt-1">
                      <Clock className="w-3.5 h-3.5" /> {recipe.prep_time_minutes + recipe.cook_time_minutes} min
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{recipe.description}</p>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-2">Ingredients</p>
                      <ul className="space-y-1.5">
                        {recipe.ingredients.map((ing, j) => (
                          <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-aj-yellow mt-1.5 flex-shrink-0" /> {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-2">Steps</p>
                      <ol className="space-y-2">
                        {recipe.steps.map((step, j) => (
                          <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-50 text-aj-yellow text-xs font-bold flex items-center justify-center mt-0.5">{j + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            {plan.cooking_tips.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-aj-yellow" /> Cooking Tips
                </h3>
                <ul className="space-y-2">
                  {plan.cooking_tips.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-aj-yellow mt-1.5 flex-shrink-0" /> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={startOver}
              className="flex items-center gap-2 text-gray-600 hover:text-aj-yellow transition font-semibold mx-auto"
            >
              <RotateCcw className="w-4 h-4" /> Plan something else
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
