import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api';

const INDIAN_PIN_PRESETS = {
  '560001': { city: 'Bengaluru', state: 'Karnataka', days: 'Tomorrow, by 2 PM' },
  '110001': { city: 'New Delhi', state: 'Delhi NCR', days: '2-3 Business Days' },
  '400001': { city: 'Mumbai', state: 'Maharashtra', days: '1-2 Business Days' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', days: '2-3 Business Days' },
  '500001': { city: 'Hyderabad', state: 'Telangana', days: '2 Business Days' }
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  
  // No default user; starts logged out
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [authError, setAuthError] = useState('');

  // Search & Filter
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Delivery & PIN Code Check
  const [pincode, setPincode] = useState('560001');
  const [pinInfo, setPinInfo] = useState(INDIAN_PIN_PRESETS['560001']);

  // Checkout modal
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMode, setPaymentMode] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // AI Assistant
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(data);
    } catch {
      // Fallback local products with images
      setProducts([
        { 
          id: '1', 
          name: 'Acoustic ANC Pro Wireless Headphones', 
          price: 12999, 
          category: 'Electronics', 
          stock: 15, 
          description: 'Active noise cancellation with 40h battery life',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
        },
        { 
          id: '2', 
          name: 'Mechanical Gaming Keyboard', 
          price: 4499, 
          category: 'Electronics', 
          stock: 20, 
          description: 'Hot-swappable tactile RGB mechanical switches',
          image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80'
        },
        { 
          id: '3', 
          name: 'Vegan Leather Office Backpack', 
          price: 2999, 
          category: 'Fashion', 
          stock: 8, 
          description: 'Water resistant with dedicated 16-inch laptop pocket',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'
        },
        { 
          id: '4', 
          name: 'Smart Fitness Band v3', 
          price: 2199, 
          category: 'Electronics', 
          stock: 12, 
          description: 'Real-time SpO2, Heart Rate & step counter',
          image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=600&q=80'
        },
        { 
          id: '5', 
          name: 'Brass South Indian Filter Kaapi Set', 
          price: 1499, 
          category: 'Home', 
          stock: 25, 
          description: 'Pure traditional heavy gauge brass coffee brewer',
          image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
        },
        { 
          id: '6', 
          name: 'Organic Bamboo Bedding Set', 
          price: 3499, 
          category: 'Home', 
          stock: 5, 
          description: 'Ultra-cooling 400TC double bedsheet with pillow covers',
          image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'
        }
      ]);
    }
  };

  const handlePincodeChange = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setPincode(clean);
    if (clean.length === 6) {
      if (INDIAN_PIN_PRESETS[clean]) {
        setPinInfo(INDIAN_PIN_PRESETS[clean]);
      } else {
        setPinInfo({ city: 'India', state: 'Express Hub', days: '2-3 Business Days' });
      }
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const exist = prev.find(p => p.id === product.id);
      if (exist) return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData(prev => ({ ...prev, phone: value.replace(/\D/g, '').slice(0, 10) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setAuthError('');

    if (formData.phone.length !== 10) {
      setAuthError('Please enter a valid 10-digit mobile number');
      return;
    }

    const trimmedUser = formData.username.trim();

    if (trimmedUser === 'admin' && formData.password === '123') {
      setUser({
        name: formData.name || 'Store Administrator',
        username: 'admin',
        email: formData.email,
        phone: `+91 ${formData.phone}`,
        role: 'admin'
      });
    } else {
      setUser({
        name: formData.name || trimmedUser,
        username: trimmedUser,
        email: formData.email,
        phone: `+91 ${formData.phone}`,
        role: 'customer'
      });
    }

    setFormData({ username: '', name: '', email: '', phone: '', password: '' });
    setShowAuthModal(false);
  };

  const handleAiConsult = async (e) => {
    e.preventDefault();
    if (!aiQuery) return;
    setAiLoading(true);
    try {
      const res = await fetch(`${API}/ai-recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiQuery })
      });
      const data = await res.json();
      setAiResponse(data);
    } catch {
      setAiResponse({
        reasoning: `Found top trending matching items within India inventory for "${aiQuery}":`,
        recommendations: products.slice(0, 2)
      });
    }
    setAiLoading(false);
  };

  const handlePlaceOrder = () => {
    const newOrder = {
      id: 'ORD-IN-' + Math.floor(100000 + Math.random() * 900000),
      txnId: paymentMode === 'upi' ? `UPI${Math.random().toString(36).substring(2, 9).toUpperCase()}` : `CARD${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      items: cart,
      total: grandTotal,
      pin: pincode,
      city: pinInfo.city
    };
    setOrderConfirmed(newOrder);
    setCart([]);
    setShowCheckout(false);
  };

  const categories = ['All', 'Electronics', 'Fashion', 'Home'];
  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = subtotal > 1999 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + delivery;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      
      {/* Top Banner */}
      <div className="bg-indigo-900 text-indigo-100 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">FREE EXPRESS</span>
            <span>Free delivery across India on all orders over ₹1,999! GST invoice included.</span>
          </div>
          <div className="flex items-center gap-4 hidden sm:flex">
            <span>24/7 Support: 1800-123-AURA</span>
            <span>•</span>
            <span>Currency: <strong>INR (₹)</strong></span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-100">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight">AuraStore</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">INDIA 🇮🇳</span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5">Official Direct Store</p>
            </div>
          </div>

          {/* Delivery Pincode Checker */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Deliver to:</span>
            <input
              type="text"
              value={pincode}
              onChange={(e) => handlePincodeChange(e.target.value)}
              className="w-16 bg-white font-bold text-slate-800 border border-slate-300 rounded px-1.5 py-0.5 text-center focus:ring-1 focus:ring-indigo-500 outline-none"
            />
            <span className="font-semibold text-indigo-700">{pinInfo.city} ({pinInfo.days})</span>
          </div>

          {/* User Account & Cart Button */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 bg-slate-100 pl-3 pr-1.5 py-1.5 rounded-full border border-slate-200">
                <div className="text-xs">
                  <div className="font-bold text-slate-800">{user.name}</div>
                  <div className="text-[10px] text-slate-500 capitalize">@{user.username} • {user.role}</div>
                </div>
                <button
                  onClick={() => setUser(null)}
                  className="bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs px-2.5 py-1 rounded-full font-semibold border border-slate-200 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm transition"
              >
                Sign In
              </button>
            )}

            {/* Cart Trigger */}
            <button
              onClick={() => setShowCheckout(true)}
              className="relative bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 transition"
            >
              <span>Cart</span>
              <span className="bg-white text-slate-900 font-extrabold w-5 h-5 rounded-full flex items-center justify-center text-[11px]">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Order Confirmed Banner */}
        {orderConfirmed && (
          <div className="mb-8 bg-emerald-50 border border-emerald-300 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-2xl shrink-0">✓</div>
              <div>
                <h3 className="text-lg font-bold text-emerald-950">Thank you! Your order is confirmed.</h3>
                <p className="text-sm text-emerald-800">Order ID: <strong>{orderConfirmed.id}</strong> • Txn ID: <code className="bg-emerald-100 px-1 py-0.5 rounded text-xs">{orderConfirmed.txnId}</code></p>
                <p className="text-xs text-emerald-700 mt-1">Dispatched to PIN {orderConfirmed.pin}, {orderConfirmed.city} with GST Tax Invoice.</p>
              </div>
            </div>
            <button onClick={() => setOrderConfirmed(null)} className="text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 hover:bg-emerald-100">
              Dismiss
            </button>
          </div>
        )}

        {/* AI Shopper Concierge Box */}
        <section className="mb-10 bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Gemini Powered
              </span>
              <span className="text-indigo-200 text-xs font-medium">Smart Indian E-Commerce Assistant</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Need help picking the right gear?</h2>
            <p className="text-indigo-200 text-sm mt-1 mb-6">Describe your budget in ₹ INR or requirements (e.g. "Work setup in Bengaluru under ₹20,000" or "Authentic filter coffee set").</p>

            <form onSubmit={handleAiConsult} className="flex gap-2">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ask e.g. Best headphones for remote work under ₹15,000..."
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder-indigo-200/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur"
              />
              <button
                type="submit"
                disabled={aiLoading}
                className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow-lg shrink-0 disabled:opacity-50"
              >
                {aiLoading ? 'Thinking...' : 'Ask AI'}
              </button>
            </form>

            {/* AI Result Card */}
            {aiResponse && (
              <div className="mt-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 text-xs">
                <p className="font-medium text-indigo-100 mb-3">{aiResponse.reasoning}</p>
                <div className="flex flex-wrap gap-2">
                  {aiResponse.recommendations?.map(p => (
                    <button
                      key={p.id}
                      onClick={() => addToCart(p)}
                      className="bg-white hover:bg-indigo-50 text-slate-900 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow"
                    >
                      <span>+ Add {p.name}</span>
                      <span className="text-indigo-600">₹{p.price.toLocaleString('en-IN')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Product Cards Grid with Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(p => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                {/* Product Image */}
                <div className="relative w-full h-52 bg-slate-100 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase bg-white/90 backdrop-blur text-slate-700 px-2.5 py-1 rounded-md shadow-sm">
                    {p.category}
                  </span>
                  <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${p.stock > 5 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                    {p.stock} in stock
                  </span>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition mb-1 leading-snug">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">
                    {p.description}
                  </p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block -mb-0.5">Price</span>
                  <span className="text-xl font-extrabold text-slate-950">₹{p.price.toLocaleString('en-IN')}</span>
                </div>
                <button
                  disabled={p.stock <= 0}
                  onClick={() => addToCart(p)}
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-indigo-100"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Drawer with Thumbnails */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="font-extrabold text-lg text-slate-900">Your Shopping Cart</h3>
                <button onClick={() => setShowCheckout(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-slate-600 text-sm">✕</button>
              </div>

              {/* Items */}
              {cart.length === 0 ? (
                <div className="py-20 text-center text-slate-400">
                  <p className="text-sm">Your cart is completely empty.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 my-4">
                  {cart.map(item => (
                    <div key={item.id} className="py-3 flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate">{item.name}</div>
                        <div className="text-[11px] text-slate-500">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-rose-600 text-xs ml-1">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Delivery Details */}
              {cart.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-3 mt-4">
                  <div className="font-bold text-slate-800">Delivering to:</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      className="w-24 bg-white border border-slate-300 rounded px-2 py-1 font-bold text-center"
                    />
                    <div className="text-[11px] text-slate-600 flex items-center">
                      {pinInfo.city}, {pinInfo.state} ({pinInfo.days})
                    </div>
                  </div>

                  {/* Payment Selection */}
                  <div className="pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1.5">Payment Method:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPaymentMode('upi')}
                        className={`p-2 rounded-lg font-bold border text-[11px] ${paymentMode === 'upi' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-200 text-slate-600'}`}
                      >
                        UPI (GPay / PhonePe)
                      </button>
                      <button
                        onClick={() => setPaymentMode('card')}
                        className={`p-2 rounded-lg font-bold border text-[11px] ${paymentMode === 'card' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-200 text-slate-600'}`}
                      >
                        RuPay / Cards
                      </button>
                    </div>

                    {paymentMode === 'upi' && (
                      <input
                        type="text"
                        placeholder="UPI ID (e.g. name@okhdfcbank)"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="mt-2 w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-600"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Checkout Action */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <div className="space-y-1 text-xs mb-3 text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="font-semibold text-emerald-600">{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total Payable</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-100 transition active:scale-98"
                >
                  Pay ₹{grandTotal.toLocaleString('en-IN')} & Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Unified All-in-One Sign-In Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Sign In / Register</h3>
                <p className="text-xs text-slate-500">Enter your details to access your account</p>
              </div>
              <button 
                onClick={() => { setShowAuthModal(false); setAuthError(''); }} 
                className="text-slate-400 hover:text-slate-600 font-bold w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {authError && (
              <div className="mb-3 text-xs bg-rose-50 text-rose-600 p-2.5 rounded-lg border border-rose-200">
                {authError}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Username *</label>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="e.g. rohan_verma or admin"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Rohan Verma"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="rohan@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Mobile Number (+91) *</label>
                <div className="flex gap-2 mt-1">
                  <span className="bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-bold text-slate-700 flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Admin hint: Username <strong>admin</strong> and Password <strong>123</strong>
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow mt-2"
              >
                Sign In & Continue
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}