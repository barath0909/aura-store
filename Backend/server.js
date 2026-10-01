const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-Memory Database
let products = [
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
];

let users = [
  { id: 'u1', name: 'Admin', email: 'admin@store.in', phone: '9876543210', password: '123' }
];

let orders = [];

// 1. GET Products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// 2. Auth: Phone OTP (Mock)
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length !== 10) {
    return res.status(400).json({ error: 'Enter a valid 10-digit Indian phone number' });
  }
  // Simulated OTP is 123456
  res.json({ message: 'OTP sent to +91 ' + phone, mockOtp: '123456' });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (otp !== '123456') {
    return res.status(400).json({ error: 'Invalid OTP! Use test code: 123456' });
  }
  let user = users.find(u => u.phone === phone);
  if (!user) {
    user = { id: 'u_' + Date.now(), name: `User ${phone.slice(-4)}`, phone };
    users.push(user);
  }
  res.json({ success: true, user });
});

// 3. Auth: Email/Password
app.post('/api/auth/login-email', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password (Hint: admin@store.in / 123)' });
  }
  res.json({ success: true, user });
});

// 4. Checkout (Indian Address & Mock UPI/Card)
app.post('/api/checkout', (req, res) => {
  const { cart, address, paymentMethod, upiId } = req.body;

  if (!cart || cart.length === 0) return res.status(400).json({ error: 'Cart is empty' });
  if (!address.pincode || address.pincode.length !== 6) {
    return res.status(400).json({ error: 'Enter a valid 6-digit PIN code' });
  }
  if (paymentMethod === 'upi' && (!upiId || !upiId.includes('@'))) {
    return res.status(400).json({ error: 'Enter a valid UPI ID (e.g. name@upi)' });
  }

  // Deduct stock
  cart.forEach(item => {
    const prod = products.find(p => p.id === item.id);
    if (prod) prod.stock -= item.quantity;
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 1999 ? 0 : 99;
  const total = subtotal + deliveryFee;

  const order = {
    orderId: 'ORD-IN-' + Math.floor(100000 + Math.random() * 900000),
    total,
    items: cart,
    txnId: 'TXN_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    date: new Date().toLocaleDateString('en-IN')
  };

  orders.push(order);
  res.json({ success: true, order });
});

// 5. AI Recommendations (Keyword-based quick matcher)
app.post('/api/ai-recommend', (req, res) => {
  const { query } = req.body;
  const q = (query || '').toLowerCase();

  let picks = products.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );

  if (picks.length === 0) picks = products.slice(0, 2);

  res.json({
    reasoning: `Based on your Indian shopping request: "${query}", here are top picks within your price range:`,
    recommendations: picks
  });
});

// --- Demo Users Table ---
const USERS = [
  { username: 'admin', password: 'password123', name: 'Admin User', role: 'admin' },
  { username: 'barath', password: 'user123', name: 'Barath J', role: 'customer' }
];

// --- Username/Password Sign-In Route ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  const user = USERS.find(
    u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
  );

  if (user) {
    return res.json({
      success: true,
      message: 'Login successful',
      user: {
        username: user.username,
        name: user.name,
        role: user.role
      }
    });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.listen(5000, () => console.log('Backend running at http://localhost:5000'));