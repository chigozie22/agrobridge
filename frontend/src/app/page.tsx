'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Truck, Leaf, Package, MapPin, Star, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'

const clusters = [
  { id: 1, name: 'FUTO - Owerri',       location: 'Imo State',   users: 512, delivery_fee: 300,  next_delivery: 'Tue & Fri' },
  { id: 2, name: 'Ikenegbu Layout',     location: 'Owerri',      users: 348, delivery_fee: 400,  next_delivery: 'Mon & Thu' },
  { id: 3, name: 'New Owerri',          location: 'Owerri',      users: 276, delivery_fee: 350,  next_delivery: 'Wed & Sat' },
  { id: 4, name: 'Egbu Road Area',      location: 'Owerri',      users: 195, delivery_fee: 450,  next_delivery: 'Tue & Fri' },
  { id: 5, name: 'Aladinma Estate',     location: 'Owerri',      users: 231, delivery_fee: 400,  next_delivery: 'Mon & Thu' },
  { id: 6, name: 'Uratta / Akachi',     location: 'Owerri North', users: 163, delivery_fee: 500, next_delivery: 'Wed & Sat' },
]

const products = [
  { name: 'Ripe Plantain',   price: '2,500',  image: '/images/products/ripe_plantain.jpg', rating: 4.8, category: 'Fruits'   },
  { name: 'Garri (25kg)',    price: '8,500',  image: '/images/products/garri.jpg',          rating: 4.9, category: 'Grains'   },
  { name: 'Frozen Fish',     price: '3,500',  image: '/images/products/frozen-fish.jpg',    rating: 4.7, category: 'Protein'  },
  { name: 'Brown Beans',     price: '6,200',  image: '/images/products/brown_beans.jpg',    rating: 4.6, category: 'Grains'   },
  { name: 'Cornflakes',      price: '4,800',  image: '/images/products/cornflakes.jpg',     rating: 4.8, category: 'Cereals'  },
  { name: 'Golden Morn',     price: '3,200',  image: '/images/products/golden_morn.jpg',    rating: 4.7, category: 'Cereals'  },
]

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        console.error('Error parsing user data:', err)
      }
    }
    setAuthChecked(true)
  }, [])

  const handleClusterSelect = (clusterName: string) => {
    const message = encodeURIComponent(`Hi! I want to join the ${clusterName} cluster on AgroBridge`)
    window.open(`https://wa.me/2348000000000?text=${message}`, '_blank')
  }

  const handleOrderNow = () => {
    const message = encodeURIComponent('Hi! I want to place an order on AgroBridge')
    window.open(`https://wa.me/2348000000000?text=${message}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        links={[
          { href: '#home', label: 'Home' },
          { href: '/clusters', label: 'Clusters' },
          { href: '/products', label: 'Products' },
          { href: '/poultry-services', label: '🥚 Poultry Services' },
          { href: '/about', label: 'About Us' },
        ]}
        rightSlot={
          !authChecked ? (
            <div className="w-24 h-9" aria-hidden="true" />
          ) : user ? (
            <>
              <Link href="/dashboard" className="text-gray-700 hover:text-aj-yellow transition font-semibold text-sm hidden sm:block">
                Dashboard
              </Link>
              <Link href="/ai-planner" className="text-gray-700 hover:text-aj-yellow transition font-semibold text-sm hidden sm:block">
                AI Planner
              </Link>
              <div className="bg-aj-yellow text-aj-dark px-4 py-2 rounded-full font-semibold text-sm">
                Cart (0)
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-aj-yellow transition font-semibold text-sm">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-aj-yellow text-aj-dark px-4 sm:px-6 py-2 rounded-full font-semibold text-sm hover:bg-yellow-400 transition"
              >
                Sign Up
              </Link>
            </>
          )
        }
      />

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-orange-50 to-yellow-50 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-aj-yellow">Smart</span> and{' '}
                <span className="text-aj-yellow">Affordable</span>
                <br />
                <span className="text-gray-900">Food Buying Through</span>
                <br />
                <span className="text-aj-green">Group Aggregation</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                AgroBridge helps you buy food at lower prices by combining orders, 
                matching items to the cheapest sellers, and delivering everything together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/signup"
                  className="bg-aj-yellow text-aj-dark px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition shadow-lg text-center"
                >
                  Get Started
                </a>
                <button 
                  onClick={() => document.getElementById('clusters')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-aj-dark px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition border-2 border-gray-200"
                >
                  Find Your Cluster
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <Truck className="w-8 h-8 text-aj-yellow mx-auto mb-2" />
                  <p className="font-semibold text-gray-900 text-sm">Fast Delivery</p>
                  <p className="text-xs text-gray-500">Within 24-48hrs</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <Leaf className="w-8 h-8 text-aj-green mx-auto mb-2" />
                  <p className="font-semibold text-gray-900 text-sm">Fresh Food</p>
                  <p className="text-xs text-gray-500">100% Fresh</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <Package className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900 text-sm">No Load Fees</p>
                  <p className="text-xs text-gray-500">Group Delivery</p>
                </div>
              </div>
            </div>

            {/* Right Content - Placeholder for food image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-aj-yellow to-orange-300 rounded-3xl p-6 sm:p-12 shadow-2xl">
                <div className="text-center">
                  <div className="text-6xl sm:text-9xl mb-4">🥘</div>
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="text-4xl sm:text-6xl">🍅</div>
                    <div className="text-4xl sm:text-6xl">🌾</div>
                    <div className="text-4xl sm:text-6xl">🥬</div>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-aj-green rounded-full p-3">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">4.8★</p>
                    <p className="text-sm text-gray-600">Customer Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clusters Section */}
      <section id="clusters" className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-aj-yellow font-semibold text-sm uppercase tracking-widest">Nearby Buying Groups</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
              Find Your <span className="text-aj-yellow">Cluster</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pool your orders with neighbours. The more people in your cluster, the lower everyone pays.
            </p>
          </div>

          {/* Summary bar */}
          <div className="bg-aj-dark rounded-2xl p-6 grid grid-cols-3 gap-4 mb-12 text-center">
            <div>
              <p className="text-3xl font-bold text-aj-yellow">6</p>
              <p className="text-gray-400 text-sm mt-0.5">Active Clusters</p>
            </div>
            <div className="border-x border-gray-700">
              <p className="text-3xl font-bold text-aj-yellow">1,725+</p>
              <p className="text-gray-400 text-sm mt-0.5">Total Members</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-aj-yellow">₦2,400</p>
              <p className="text-gray-400 text-sm mt-0.5">Avg Monthly Savings</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clusters.map((cluster) => (
              <div key={cluster.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group border border-gray-100">
                <div className="h-1.5 bg-gradient-to-r from-aj-yellow to-orange-400" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 text-xs font-bold px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                      ACTIVE
                    </span>
                    <span className="text-xs text-gray-400 font-medium">Cluster #{cluster.id}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-aj-yellow transition-colors">
                    {cluster.name}
                  </h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mb-5">
                    <MapPin className="w-3.5 h-3.5 text-aj-yellow flex-shrink-0" />
                    {cluster.location}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-5">
                    <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                      <p className="text-lg font-bold text-gray-900">{cluster.users}+</p>
                      <p className="text-xs text-gray-500">Members</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-2.5 text-center">
                      <p className="text-lg font-bold text-aj-yellow">₦{cluster.delivery_fee}</p>
                      <p className="text-xs text-gray-500">Delivery</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-2.5 text-center">
                      <p className="text-xs font-bold text-gray-700 leading-tight">{cluster.next_delivery}</p>
                      <p className="text-xs text-gray-500">Delivery days</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleClusterSelect(cluster.name)}
                    className="w-full bg-gradient-to-r from-aj-yellow to-orange-400 text-aj-dark py-3 rounded-xl font-bold hover:from-yellow-400 transition flex items-center justify-center gap-2 text-sm"
                  >
                    Join This Cluster <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't see your area?{' '}
            <button
              onClick={() => handleClusterSelect('a new area')}
              className="text-aj-yellow font-semibold hover:underline"
            >
              Request a new cluster →
            </button>
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-aj-yellow font-semibold text-sm uppercase tracking-widest">Fresh & Affordable</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
              Our <span className="text-aj-yellow">Best Selling</span> Products
            </h2>
            <p className="text-lg text-gray-600">Sourced directly from verified vendors near you</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group">
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-orange-100 to-yellow-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-aj-yellow text-xs font-bold px-2.5 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                  <div className="flex items-center gap-1.5 mb-4">
                    <div className="flex text-yellow-400 text-sm">{'★'.repeat(Math.floor(product.rating))}</div>
                    <span className="text-sm text-gray-500">({product.rating})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₦{product.price}</span>
                      <span className="text-sm text-gray-500">/unit</span>
                    </div>
                    <a
                      href="/products"
                      className="bg-aj-yellow text-aj-dark px-5 py-2 rounded-xl font-bold hover:bg-yellow-400 transition text-sm"
                    >
                      Order
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="/products"
              className="inline-block bg-aj-dark text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition"
            >
              See All Products →
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How <span className="text-aj-yellow">AgroBridge</span> Works
            </h2>
            <p className="text-xl text-gray-600">Three simple steps to save on food</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-aj-yellow rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-aj-dark mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Join a Cluster</h3>
              <p className="text-gray-600">You're grouped with people near you for maximum efficiency</p>
            </div>
            <div className="text-center">
              <div className="bg-aj-yellow rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-aj-dark mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">We Aggregate Orders</h3>
              <p className="text-gray-600">Orders are combined and matched to the cheapest verified sellers</p>
            </div>
            <div className="text-center">
              <div className="bg-aj-yellow rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-aj-dark mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">One Delivery</h3>
              <p className="text-gray-600">Everything arrives together — no load charges, no stress</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-aj-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Powered by <span className="text-aj-yellow">AJ-Fresh Farmfoods</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                AgroBridge is built on years of experience in food logistics and distribution. 
                We work directly with local farmers and verified vendors to bring you the best 
                prices without compromising on quality.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-aj-green/20 rounded-xl p-4">
                  <p className="text-3xl font-bold text-aj-yellow mb-2">1000+</p>
                  <p className="text-gray-300">Active Users</p>
                </div>
                <div className="bg-aj-green/20 rounded-xl p-4">
                  <p className="text-3xl font-bold text-aj-yellow mb-2">50+</p>
                  <p className="text-gray-300">Verified Vendors</p>
                </div>
                <div className="bg-aj-green/20 rounded-xl p-4">
                  <p className="text-3xl font-bold text-aj-yellow mb-2">5</p>
                  <p className="text-gray-300">Active Clusters</p>
                </div>
                <div className="bg-aj-green/20 rounded-xl p-4">
                  <p className="text-3xl font-bold text-aj-yellow mb-2">15%</p>
                  <p className="text-gray-300">Average Savings</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white text-gray-900 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">✓</div>
                <p className="font-semibold">Government Registered</p>
              </div>
              <div className="bg-white text-gray-900 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">👥</div>
                <p className="font-semibold">On-Ground Agents</p>
              </div>
              <div className="bg-white text-gray-900 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">🌱</div>
                <p className="font-semibold">Local Sourcing</p>
              </div>
              <div className="bg-white text-gray-900 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">🚀</div>
                <p className="font-semibold">Pilot Success</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-aj-yellow to-orange-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-aj-dark mb-6">
            Ready to Start Saving on Food?
          </h2>
          <p className="text-xl text-gray-800 mb-8">
            Join thousands of smart shoppers already saving 15% on their food bills
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="bg-aj-dark text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition text-center"
            >
              Create Account
            </a>
            <button 
              onClick={handleOrderNow}
              className="bg-white text-aj-dark px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition"
            >
              Chat on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-aj-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-white">Agro</span>
                <span className="text-aj-yellow">Bridge</span>
              </h3>
              <p className="text-gray-400">Smart food buying through group aggregation</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-aj-yellow transition">Home</a></li>
                <li><a href="#clusters" className="hover:text-aj-yellow transition">Clusters</a></li>
                <li><a href="#products" className="hover:text-aj-yellow transition">Products</a></li>
                <li><a href="#about" className="hover:text-aj-yellow transition">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Phone: +234 800 000 0000</li>
                <li>Email: hello@agrobridge.ng</li>
                <li>Location: Enugu, Nigeria</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Powered By</h4>
              <p className="text-aj-yellow font-bold text-xl">AJ-Fresh Farmfoods</p>
              <p className="text-gray-400 text-sm mt-2">Registered & Verified</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2026 AgroBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}