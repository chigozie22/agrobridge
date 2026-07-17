import Link from 'next/link'
import { ArrowRight, Users, ShoppingBag, Truck, TrendingDown } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar
        links={[
          { href: '/products', label: 'Products' },
          { href: '/clusters', label: 'Clusters' },
          { href: '/ai-planner', label: 'AI Planner' },
        ]}
        rightSlot={
          <>
            <Link href="/login" className="text-gray-700 hover:text-aj-yellow text-sm font-semibold transition">Login</Link>
            <Link href="/signup" className="bg-aj-yellow text-gray-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition">Sign Up</Link>
          </>
        }
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-aj-green text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">About <span className="text-aj-yellow">AgroBridge</span></h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            We help students and residents in Owerri buy fresh food at lower prices by combining their orders and delivering together.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-aj-yellow font-bold text-sm uppercase tracking-widest">Our Mission</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Food Shouldn't Be Expensive</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              AgroBridge was founded on a simple idea: if neighbours pool their food orders together, everyone gets better prices. We connect buyers in the same area (clusters), aggregate their orders, source from the cheapest verified vendors, and deliver once — splitting the cost of delivery.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We started in Owerri, serving FUTO students and residents across the city's major residential clusters, and we're growing fast.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: TrendingDown, label: 'Average Savings', value: '20–30%', color: 'bg-green-50 text-green-700' },
              { icon: Users, label: 'Active Members', value: '1,725+', color: 'bg-blue-50 text-blue-700' },
              { icon: ShoppingBag, label: 'Products', value: '50+', color: 'bg-yellow-50 text-yellow-700' },
              { icon: Truck, label: 'Clusters Served', value: '7', color: 'bg-orange-50 text-orange-700' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className={`rounded-2xl p-5 ${color}`}>
                <Icon className="w-6 h-6 mb-3 opacity-70" />
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm opacity-80">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-aj-yellow font-bold text-sm uppercase tracking-widest">How It Works</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Simple. Smart. Affordable.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Join a Cluster', desc: 'Sign up and pick the buying group nearest to where you live.' },
              { step: '2', title: 'Place Your Order', desc: 'Browse products and combos. Add what you need to your cart.' },
              { step: '3', title: 'We Aggregate', desc: "Your order is combined with your cluster's orders for bulk pricing." },
              { step: '4', title: 'Get Delivered', desc: 'One delivery to your cluster — low fee, shared cost.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 bg-aj-yellow text-gray-900 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">{step}</div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="text-aj-yellow font-bold text-sm uppercase tracking-widest">What We Offer</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">Our Services</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              emoji: '🥦',
              title: 'Fresh Produce',
              desc: 'Vegetables, tubers, grains and pantry staples sourced directly from verified local vendors.',
            },
            {
              emoji: '📦',
              title: 'Food Combo Packages',
              desc: 'Pre-curated bundles like the ₦40K Family Pack designed to cover a month of essentials at wholesale prices.',
            },
            {
              emoji: '🥚',
              title: 'AJFreshFarmFoods Poultry',
              desc: 'Door-to-door delivery of fresh eggs across all 6 major Owerri clusters. ₦5,650/crate.',
            },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">{emoji}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="text-gray-400 mb-8">Have questions or want to partner with us?</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="mailto:trentjoshuaeee@gmail.com" className="text-aj-yellow hover:underline">trentjoshuaeee@gmail.com</a>
            <span className="text-gray-600">|</span>
            <span className="text-gray-300">Owerri, Imo State, Nigeria</span>
          </div>
          <div className="mt-10">
            <Link href="/signup"
              className="inline-flex items-center gap-2 bg-aj-yellow text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition">
              Start Saving Today <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
