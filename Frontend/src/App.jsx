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
  const [user, setUser] = useState({ name: 'Rohan Verma', phone: '+91 98765 43210', role: 'customer' });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'email'
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
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
  const [upiId, setUpiId] = useState('rohan@okhdfcbank');
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

  const handleSendOtp = () => {
    setAuthError('');
    if (phoneInput.length !== 10) {
      setAuthError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setOtpSent(true);
    setOtpInput('123456');
  };

  const handleVerifyOtp = () => {
    if (otpInput !== '123456') {
      setAuthError('Invalid OTP! Please use 123456');
      return;
    }
    setUser({ name: `User +91 ${phoneInput}`, phone: `+91 ${phoneInput}`, role: 'customer' });
    setShowAuthModal(false);
    setOtpSent(false);
    setPhoneInput('');
    setOtpInput('');
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    if (emailInput === 'admin@store.in' && passwordInput === '123') {
      setUser({ name: 'Store Administrator', email: emailInput, role: 'admin' });
      setShowAuthModal(false);
    } else {
      setUser({ name: emailInput.split('@')[0], email: emailInput, role: 'customer' });
      setShowAuthModal(false);
    }
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
                  <div className="text-[10px] text-slate-500 capitalize">{user.role}</div>
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
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm transition"
              >
                Sign In
              </button>
            )}

            {/* Cart Trigger */}
            <button
              onClick={() => setShowCheckout(true)}
              className="relative bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 transition"
            >
              <span>Cart</span>
              <span className="bg-white text-indigo-700 font-extrabold w-5 h-5 rounded-full flex items-center justify-center text-[11px]">
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

      {/* Multi-Option Sign-In Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-lg text-slate-900">Sign In to AuraStore</h3>
              <button onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-4">
              <button
                onClick={() => { setAuthMethod('phone'); setAuthError(''); }}
                className={`flex-1 py-2 text-xs font-bold border-b-2 transition ${authMethod === 'phone' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
              >
                Mobile OTP (+91)
              </button>
              <button
                onClick={() => { setAuthMethod('email'); setAuthError(''); }}
                className={`flex-1 py-2 text-xs font-bold border-b-2 transition ${authMethod === 'email' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
              >
                Email & Password
              </button>
            </div>

            {authError && (
              <div className="mb-3 text-[11px] bg-rose-50 text-rose-600 p-2.5 rounded-lg border border-rose-200">
                {authError}
              </div>
            )}

            {authMethod === 'phone' ? (
              <div>
                {!otpSent ? (
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase">Indian Mobile Number</label>
                    <div className="flex gap-2 mt-1 mb-3">
                      <span className="bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-bold text-slate-700 flex items-center">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="98765 43210"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600"
                      />
                    </div>
                    <button
                      onClick={handleSendOtp}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow"
                    >
                      Get 6-Digit OTP
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase">Enter 6-Digit OTP</label>
                    <p className="text-[10px] text-slate-400 mb-2">Simulated OTP auto-filled: 123456</p>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-center text-lg tracking-widest font-black focus:outline-none focus:ring-1 focus:ring-indigo-600 mb-3"
                    />
                    <button
                      onClick={handleVerifyOtp}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow"
                    >
                      Verify & Sign In
                    </button>
                    <button
                      onClick={() => setOtpSent(false)}
                      className="w-full text-slate-500 text-[11px] mt-2 text-center"
                    >
                      Change Number
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleEmailLogin} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@store.in"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="123"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                  <span className="text-[10px] text-slate-400">Admin hint: admin@store.in / 123</span>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow"
                >
                  Sign In
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}