import { Pizza, Clock, Shield, Zap, Star, ChevronRight, Phone, Mail, MapPin, Award, Truck, Heart } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                <Pizza className="w-6 h-6 text-white" />
              </div>
              <span className="text-slate-900 font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                Pizzeria
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#menu" className="text-slate-700 hover:text-orange-600 font-medium transition-colors">Menu</a>
              <a href="#about" className="text-slate-700 hover:text-orange-600 font-medium transition-colors">About</a>
              <a href="#contact" className="text-slate-700 hover:text-orange-600 font-medium transition-colors">Contact</a>
            </div>
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              Order Now <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-white to-white">
        <div className="container mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white border border-orange-200 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                Free Delivery on Orders Above ₹499
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Authentic Italian<br />
                Pizza Delivered to<br />
                <span className="text-orange-600">Your Doorstep</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                Experience the taste of Italy with our wood-fired pizzas made from the finest ingredients. Fresh dough prepared daily, premium toppings, and delivered hot in 30 minutes.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-xl font-bold text-base hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Order Now <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={onGetStarted}
                  className="bg-white border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl font-semibold text-base hover:border-orange-400 hover:bg-orange-50 transition-all duration-300"
                >
                  View Menu
                </button>
              </div>
              <div className="flex items-center gap-10 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">4.9/5</p>
                    <p className="text-xs text-slate-500">From 10,000+ reviews</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">30 min</p>
                    <p className="text-xs text-slate-500">Average delivery</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative lg:h-[500px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-600/20 rounded-full blur-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=700&h=700&fit=crop&auto=format"
                alt="Delicious Pizza"
                className="relative rounded-2xl shadow-2xl w-full max-w-lg h-auto object-cover"
              />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4 border border-slate-100">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Express Delivery</p>
                  <p className="font-bold text-slate-900">Track your order live</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Why Customers Love Us
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              We're committed to delivering the best pizza experience with quality, speed, and care
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Clock,
                title: "30-Min Delivery",
                description: "Hot, fresh pizzas delivered to your door in 30 minutes or less, guaranteed",
                color: "text-orange-600",
                bg: "bg-orange-50",
              },
              {
                icon: Award,
                title: "Premium Quality",
                description: "100% authentic Italian ingredients with fresh dough made daily in-house",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Shield,
                title: "Safe & Hygienic",
                description: "Contactless delivery with strict hygiene protocols for your safety",
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                icon: Star,
                title: "Top Rated",
                description: "Rated 4.9/5 stars by over 10,000 satisfied customers nationwide",
                color: "text-yellow-600",
                bg: "bg-yellow-50",
              },
              {
                icon: Heart,
                title: "Made with Love",
                description: "Every pizza is handcrafted by expert chefs with passion and care",
                color: "text-red-600",
                bg: "bg-red-50",
              },
              {
                icon: Truck,
                title: "Live Tracking",
                description: "Track your order in real-time from kitchen to your doorstep",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
            ].map(({ icon: Icon, title, description, color, bg }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 ${color}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Pizzas Section */}
      <section className="py-20 bg-white" id="menu">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Most Popular Pizzas
            </h2>
            <p className="text-base text-slate-600">
              Handpicked favorites loved by our customers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Margherita Classic",
                price: "₹299",
                image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop&auto=format",
                rating: "4.8",
                orders: "2,340",
                description: "Fresh mozzarella, basil & tomato sauce",
                tag: "Vegetarian",
              },
              {
                name: "Pepperoni Supreme",
                price: "₹399",
                image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop&auto=format",
                rating: "4.9",
                orders: "3,120",
                description: "Premium pepperoni & mozzarella",
                tag: "Bestseller",
              },
              {
                name: "Farmhouse Special",
                price: "₹349",
                image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop&auto=format",
                rating: "4.7",
                orders: "1,890",
                description: "Fresh veggies, corn & capsicum",
                tag: "Healthy",
              },
            ].map((pizza) => (
              <div
                key={pizza.name}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative overflow-hidden h-56">
                  <img
                    src={pizza.image}
                    alt={pizza.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-lg text-xs font-bold text-orange-600 shadow-md">
                    {pizza.tag}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-slate-900 text-sm">{pizza.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {pizza.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">{pizza.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-orange-600" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {pizza.price}
                      </p>
                      <p className="text-xs text-slate-500">{pizza.orders} orders</p>
                    </div>
                    <button
                      onClick={onGetStarted}
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={onGetStarted}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
            >
              View Full Menu <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              How It Works
            </h2>
            <p className="text-base text-slate-600">
              Order your favorite pizza in just a few simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Browse Menu", desc: "Choose from our wide selection of delicious pizzas" },
              { step: "2", title: "Customize", desc: "Add your favorite toppings and extras" },
              { step: "3", title: "Place Order", desc: "Select delivery address and payment method" },
              { step: "4", title: "Enjoy!", desc: "Get hot pizza delivered in 30 minutes" },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-600 relative overflow-hidden" id="contact">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to Order?
          </h2>
          <p className="text-lg text-white/95 mb-8 max-w-2xl mx-auto">
            Join over 10,000 happy customers. Get your favorite pizza delivered hot and fresh in just 30 minutes!
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-orange-600 px-10 py-4 rounded-xl font-bold text-base hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
          >
            Order Now <ChevronRight className="w-5 h-5" />
          </button>
          <p className="text-white/80 text-sm mt-4">Free delivery on orders above ₹499</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12" id="about">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Pizza className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Pizzeria
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Delivering authentic Italian pizzas across India since 2015. Made with love, served with care.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><button onClick={onGetStarted} className="hover:text-orange-400 transition-colors">Order Online</button></li>
                <li><button onClick={onGetStarted} className="hover:text-orange-400 transition-colors">Our Menu</button></li>
                <li><button onClick={onGetStarted} className="hover:text-orange-400 transition-colors">Track Order</button></li>
                <li><button className="hover:text-orange-400 transition-colors">Locations</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Support</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><button className="hover:text-orange-400 transition-colors">FAQs</button></li>
                <li><button className="hover:text-orange-400 transition-colors">Terms of Service</button></li>
                <li><button className="hover:text-orange-400 transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-orange-400 transition-colors">Refund Policy</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Contact Us</h4>
              <div className="space-y-3 text-slate-400 text-sm">
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">1800-123-PIZZA</p>
                    <p className="text-xs">Mon-Sun: 10 AM - 11 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>support@pizzeria.in</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Available in Delhi, Mumbai, Bangalore & 50+ cities</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-sm">
            <p>&copy; 2026 Pizzeria. All rights reserved.</p>
            <p>Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
