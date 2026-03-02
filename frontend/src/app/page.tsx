'use client'

import { Truck, Leaf, Package, MapPin, Star, ChevronRight } from 'lucide-react'

const clusters = [
  { id: 1, name: 'ESUT - Agbani', location: 'Enugu State', users: 234 },
  { id: 2, name: 'UNN - Nsukka', location: 'Enugu State', users: 456 },
  { id: 3, name: 'Trans Ekulu Estate', location: 'Enugu', users: 189 },
  { id: 4, name: 'Independence Layout', location: 'Enugu', users: 312 },
  { id: 5, name: 'Akwata Market', location: 'Enugu', users: 167 },
]

const products = [
  { name: 'Fresh Tomatoes', price: '750', image: '🍅', rating: 4.8, category: 'Vegetables' },
  { name: 'Local Rice (50kg)', price: '45,000', image: '🌾', rating: 4.9, category: 'Grains' },
  { name: 'Fresh Yam', price: '1,200', image: '🍠', rating: 4.7, category: 'Tubers' },
  { name: 'Plantain (Bunch)', price: '2,500', image: '🍌', rating: 4.6, category: 'Fruits' },
  { name: 'Fresh Fish', price: '3,500', image: '🐟', rating: 4.8, category: 'Protein' },
  { name: 'Palm Oil (4L)', price: '8,000', image: '🛢️', rating: 4.9, category: 'Cooking' },
]

export default function Home() {
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
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">
                <span className="text-aj-dark">Agro</span>
                <span className="text-aj-yellow">Bridge</span>
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-aj-yellow transition">Home</a>
              <a href="#clusters" className="text-gray-700 hover:text-aj-yellow transition">Clusters</a>
              <a href="#products" className="text-gray-700 hover:text-aj-yellow transition">Products</a>
              <a href="#about" className="text-gray-700 hover:text-aj-yellow transition">About Us</a>
              <a href="/login" className="text-gray-700 hover:text-aj-yellow transition font-semibold">
                Login
              </a>
              <a 
                href="/signup"
                className="bg-aj-yellow text-aj-dark px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-orange-50 to-yellow-50 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
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
              <div className="grid grid-cols-3 gap-4 mt-12">
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
              <div className="bg-gradient-to-br from-aj-yellow to-orange-300 rounded-3xl p-12 shadow-2xl">
                <div className="text-center">
                  <div className="text-9xl mb-4">🥘</div>
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="text-6xl">🍅</div>
                    <div className="text-6xl">🌾</div>
                    <div className="text-6xl">🥬</div>
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
      <section id="clusters" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-aj-yellow">Active</span> Clusters
            </h2>
            <p className="text-xl text-gray-600">Join a cluster near you and start saving on food</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clusters.map((cluster) => (
              <button
                key={cluster.id}
                onClick={() => handleClusterSelect(cluster.name)}
                className="bg-white border-2 border-gray-200 hover:border-aj-yellow rounded-2xl p-6 text-left transition-all hover:shadow-xl group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-orange-100 rounded-full p-3">
                    <MapPin className="w-6 h-6 text-aj-yellow" />
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-aj-yellow transition" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cluster.name}</h3>
                <p className="text-gray-600 mb-4">{cluster.location}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-aj-green border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-aj-yellow border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-orange-400 border-2 border-white"></div>
                  </div>
                  <span>{cluster.users}+ members</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-aj-yellow">Best Selling</span> Products
            </h2>
            <p className="text-xl text-gray-600">Fresh from farm to your table</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition group">
                <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-12 flex items-center justify-center">
                  <div className="text-8xl">{product.image}</div>
                </div>
                <div className="p-6">
                  <div className="text-xs text-aj-yellow font-semibold mb-2">{product.category}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(Math.floor(product.rating))}
                    </div>
                    <span className="text-sm text-gray-600">({product.rating})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-aj-green">₦{product.price}</span>
                      <span className="text-sm text-gray-500">/unit</span>
                    </div>
                    <button 
                      onClick={() => window.location.href = '/signup'}
                      className="bg-aj-yellow text-aj-dark px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition"
                    >
                      Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/signup"
              className="inline-block bg-aj-dark text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition"
            >
              Get Started - See All Products
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
