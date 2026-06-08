import { useState } from "react";
import { Star, Flame, Leaf, ArrowRight, Clock, ChefHat, Bike, CheckCircle2, Phone } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { CartItem, Ingredient } from "../types";
import { BuilderModal } from "./BuilderModal";

export interface Pizza {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  isVeg: boolean;
}

export const PIZZAS: Pizza[] = [
  { id: 1, name: "Margherita Classic", description: "San Marzano tomato, fresh mozzarella, fragrant basil, extra-virgin olive oil on a hand-tossed base.", ingredients: ["Mozzarella", "Tomato", "Basil", "Olive Oil"], price: 299, rating: 4.8, reviews: 342, image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&h=400&fit=crop&auto=format", badge: "Bestseller", badgeColor: "#2e7d32", isVeg: true },
  { id: 2, name: "Pepperoni Royale", description: "Generous layer of premium pepperoni on a rich tomato base with stretchy mozzarella.", ingredients: ["Pepperoni", "Mozzarella", "Tomato Sauce", "Oregano"], price: 499, rating: 4.9, reviews: 521, image: "https://images.unsplash.com/photo-1592229005296-735b0f6c0722?w=600&h=400&fit=crop&auto=format", badge: "Fan Fav", badgeColor: "#c0392b", isVeg: false },
  { id: 3, name: "BBQ Chicken", description: "Smoky BBQ sauce, grilled chicken breast, red onion, cheddar, and a drizzle of ranch.", ingredients: ["Chicken", "BBQ Sauce", "Red Onion", "Cheddar", "Ranch"], price: 449, rating: 4.7, reviews: 278, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&auto=format", isVeg: false },
  { id: 4, name: "Garden Veggie", description: "A colourful medley of fresh capsicum, mushrooms, red onion, corn, and black olives.", ingredients: ["Capsicum", "Mushroom", "Onion", "Corn", "Olive", "Pesto"], price: 349, rating: 4.6, reviews: 189, image: "https://images.unsplash.com/photo-1717250180588-8737e18314d3?w=600&h=400&fit=crop&auto=format", badge: "Vegan", badgeColor: "#388e3c", isVeg: true },
  { id: 5, name: "Four Cheese", description: "A cheese lover's dream — mozzarella, cheddar, parmesan, and gooey cheese burst base.", ingredients: ["Mozzarella", "Cheddar", "Parmesan", "Ricotta", "Garlic"], price: 549, rating: 4.8, reviews: 413, image: "https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=600&h=400&fit=crop&auto=format", isVeg: true },
  { id: 6, name: "Spicy Buffalo", description: "Buffalo-style hot sauce, crispy chicken strips, jalapeños, blue cheese crumble, and scallions.", ingredients: ["Chicken", "Buffalo Sauce", "Jalapeño", "Blue Cheese", "Scallion"], price: 479, rating: 4.5, reviews: 224, image: "https://images.unsplash.com/photo-1652952561151-97e82f26c336?w=600&h=400&fit=crop&auto=format", badge: "🌶️ Spicy", badgeColor: "#e65100", isVeg: false },
];

const CATEGORIES = ["All", "Veg", "Non-Veg", "Bestsellers"];
const FEATURES = [
  { icon: Clock, title: "30 Min Delivery", desc: "Hot pizza or your money back, guaranteed." },
  { icon: ChefHat, title: "Chef's Recipe", desc: "Handcrafted dough, slow-cooked tomato sauce." },
  { icon: Flame, title: "Wood-Fired Oven", desc: "Baked at 400°C for the perfect crisp." },
  { icon: Bike, title: "Live Tracking", desc: "Track from kitchen to doorstep in real-time." },
];

export function HomePage() {
  const { addToCart, navigate } = useApp();
  const [category, setCategory] = useState("All");
  const [builderPizza, setBuilderPizza] = useState<Pizza | null>(null);
  const [adding, setAdding] = useState<number | null>(null);

  const filtered = PIZZAS.filter((p) => {
    if (category === "All") return true;
    if (category === "Veg") return p.isVeg;
    if (category === "Non-Veg") return !p.isVeg;
    if (category === "Bestsellers") return p.rating >= 4.8;
    return true;
  });

  const handleQuickAdd = async (pizza: Pizza) => {
    setAdding(pizza.id);
    const item: CartItem = {
      id: `pizza-${pizza.id}-${Date.now()}`,
      pizzaId: pizza.id, name: pizza.name,
      base: "Thin Crust", sauce: "Tomato", cheese: "Mozzarella",
      veggies: [], meats: [], price: pizza.price, quantity: 1, image: pizza.image,
    };
    await addToCart(item);
    setAdding(null);
  };

  const handleBuilderAdd = async (item: CartItem) => {
    await addToCart(item);
    setBuilderPizza(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden flex items-center" style={{ minHeight: "82vh" }}>
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=1600&h=900&fit=crop&auto=format" alt="Pizza" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, rgba(26,18,8,0.93) 42%, rgba(192,57,43,0.4) 100%)" }} />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-8 border border-white/10 translate-x-1/3 hidden lg:block" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/75 text-xs tracking-wide">Delivering across Mumbai · Delhi · Bangalore</span>
            </div>
            <h1 className="text-white mb-5 leading-none" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 6vw, 4rem)", fontWeight: 900, lineHeight: 1.05 }}>
              Pizza Like You've <br /><span style={{ color: "#e67e22" }}>Never Tasted</span><br />Before.
            </h1>
            <p className="text-white/60 mb-8 text-base leading-relaxed max-w-md">
              Handcrafted in a wood-fired oven, loaded with premium toppings, and at your door in 30 minutes flat.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <a href="#menu" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg">
                Order Now <ArrowRight className="w-4 h-4" />
              </a>
              <button onClick={() => setBuilderPizza(PIZZAS[0])} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition-colors">
                Build Your Own
              </button>
            </div>
            <div className="flex flex-wrap gap-8">
              {[["2,100+", "Happy Customers"], ["4.9★", "App Rating"], ["30 min", "Avg. Delivery"]].map(([val, label]) => (
                <div key={label}>
                  <p className="text-white font-bold" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem" }}>{val}</p>
                  <p className="text-white/45 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Floating card */}
          <div className="hidden lg:flex justify-end">
            <div className="relative w-72">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img src="https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=600&h=700&fit=crop&auto=format" alt="Today's special" className="w-full h-72 object-cover" />
                <div className="bg-card p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Today's Special</p>
                    <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /><span className="text-xs font-bold">4.9</span></div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Truffle mushroom with double cheese burst</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>₹549</span>
                    <button onClick={() => handleQuickAdd(PIZZAS[4])} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
                      {adding === 5 ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-accent text-white rounded-2xl px-3 py-2 shadow-lg text-center">
                <p className="text-xs font-bold">FREE</p>
                <p className="text-xs opacity-80">Delivery</p>
                <p className="text-xs opacity-80">₹499+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-14 bg-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-accent text-xs uppercase tracking-widest mb-2">Why Choose Us</p>
            <h2 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem" }}>Every Pizza, A Promise</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-colors">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <p className="text-white font-semibold text-sm mb-1">{title}</p>
                <p className="text-white/45 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFER BANNER */}
      <section className="py-8 bg-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-primary-foreground/65 text-xs uppercase tracking-widest mb-1">Limited Time</p>
            <h3 className="text-primary-foreground" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700 }}>
              🎉 Buy 2 Get 1 Free on all Large Pizzas
            </h3>
            <p className="text-primary-foreground/65 text-sm mt-1">Use code <strong className="text-white">PIZZA3</strong> at checkout · Valid till midnight</p>
          </div>
          <div className="bg-white/15 border border-white/20 rounded-xl px-5 py-2.5 text-white font-bold tracking-widest text-sm">
            PIZZA3
          </div>
        </div>
      </section>

      {/* MENU */}
      <main id="menu" className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
          <div>
            <p className="text-accent text-xs uppercase tracking-widest mb-1">Our Menu</p>
            <h2 className="text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem" }}>Choose Your Favourite</h2>
            <p className="text-muted-foreground text-sm mt-0.5">{filtered.length} pizzas available today</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm transition-all ${category === cat ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground hover:bg-primary/10"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((pizza) => (
            <div key={pizza.id} className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col group">
              <div className="relative h-52 bg-muted overflow-hidden">
                <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.2), transparent 60%)" }} />
                {pizza.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-semibold shadow" style={{ backgroundColor: pizza.badgeColor }}>
                    {pizza.badge}
                  </span>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-foreground">{pizza.rating}</span>
                  <span className="text-xs text-muted-foreground">({pizza.reviews})</span>
                </div>
                {pizza.isVeg && (
                  <div className="absolute bottom-3 left-3 bg-green-600 rounded-full p-1">
                    <Leaf className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-foreground mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{pizza.name}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{pizza.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {pizza.ingredients.slice(0, 4).map((ing) => (
                    <span key={ing} className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">{ing}</span>
                  ))}
                  {pizza.ingredients.length > 4 && <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">+{pizza.ingredients.length - 4}</span>}
                </div>
                <div className="mt-auto flex items-center justify-between gap-2">
                  <span className="text-primary" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700 }}>₹{pizza.price}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setBuilderPizza(pizza)}
                      className="px-3 py-1.5 rounded-xl border border-primary text-primary text-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                      Customize
                    </button>
                    <button onClick={() => handleQuickAdd(pizza)} disabled={adding === pizza.id}
                      className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity disabled:opacity-60">
                      {adding === pizza.id ? "Adding..." : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* TESTIMONIALS */}
      <section className="bg-secondary py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <p className="text-accent text-xs uppercase tracking-widest mb-2">Reviews</p>
            <h2 className="text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem" }}>What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { name: "Rahul S., Mumbai", text: "Ordered at 8 PM and pizza arrived in 28 minutes, piping hot. The cheese burst base is divine!", rating: 5 },
              { name: "Priya V., Delhi", text: "Garden Veggie is my go-to every Friday. Fresh toppings, generous portions — worth every rupee.", rating: 5 },
              { name: "Arjun K., Bangalore", text: "Spicy Buffalo had me sweating but I couldn't stop eating. Real heat, real flavour. 10/10!", rating: 5 },
            ].map(({ name, text, rating }) => (
              <div key={name} className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                <div className="flex gap-0.5 mb-3">{Array.from({ length: rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground leading-relaxed mb-4">"{text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary text-xs font-bold">{name[0]}</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground">{name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-foreground font-semibold">Pizzeria</span>
            <span>— Handcrafted with love 🍕</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /><span>+91 98765 43210</span></div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /><span>FSSAI Certified</span></div>
            <div className="flex items-center gap-1.5"><Leaf className="w-3.5 h-3.5 text-green-500" /><span>Veg options</span></div>
          </div>
        </div>
      </footer>

      {builderPizza && (
        <BuilderModal pizza={builderPizza} onClose={() => setBuilderPizza(null)} onAdd={handleBuilderAdd} />
      )}
    </div>
  );
}
