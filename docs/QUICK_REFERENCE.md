# ⚡ Developer Quick Reference

A quick lookup guide for Mahii developers.

---

## 🚀 Startup Commands

```bash
# Terminal 1: Start Backend Server
cd server
npm install (first time only)
npm run dev

# Terminal 2: Start Frontend Dev Server
cd client
npm install (first time only)
npm start

# Terminal 3 (Optional): MongoDB Admin (if local)
mongosh "mongodb+srv://..."
```

**Expected Outputs:**
```
Backend: 🚀 Server running on http://localhost:5000
Frontend: On Your Network: http://localhost:3000
```

---

## 📡 API Quick Reference

### Authentication
```javascript
// Register
POST /api/auth/customer/register
{ name, email, password, phone, college }

// Login
POST /api/auth/login
{ email, password }

// Get Current User
GET /api/auth/me
Header: Authorization: Bearer <token>
```

### Shops
```javascript
// Get Nearby Shops
GET /api/shops/nearby?lat=18.5204&lng=73.8567&radius=10

// Get Shop Details
GET /api/shops/:id
```

### Products
```javascript
// Get Shop Products
GET /api/products/shop/:shopId?page=1&limit=10

// Search Products
GET /api/products/search?q=biryani
```

### Orders
```javascript
// Create Order
POST /api/orders
{ items: [...], shopId, totalAmount, paymentMethod }

// Get My Orders
GET /api/orders/my-orders

// Get Order Details
GET /api/orders/:id
```

### Subscriptions
```javascript
// Get Subscription Plans
GET /api/subscriptions/plans/:shopId

// Create Subscription
POST /api/subscriptions/create
{ shopId, planId, startDate, mealType }

// Get My Subscriptions
GET /api/subscriptions/my

// Mark Attendance
POST /api/subscriptions/attendance
{ subscriptionId, date, attended: true }
```

### Payments
```javascript
// Create Razorpay Order
POST /api/payments/create-order
{ orderId, amount }

// Verify Payment
POST /api/payments/verify
{ razorpay_payment_id, razorpay_order_id, razorpay_signature }
```

---

## 🗂️ File Structure Overview

```
server/
  ├── controllers/          → Business logic
  │   ├── authController
  │   ├── shopController
  │   ├── orderController
  │   ├── subscriptionController
  │   └── paymentController
  ├── models/              → MongoDB schemas
  ├── routes/              → Express routes
  ├── middleware/          → Auth, validation
  ├── services/            → Razorpay, email
  └── server.js            → Main file

client/
  ├── src/
  │   ├── components/      → Reusable components
  │   ├── pages/           → Page components
  │   ├── contexts/        → Auth, Cart, Theme
  │   ├── services/        → API calls (api.js)
  │   ├── App.js           → Root component
  │   └── index.js         → ReactDOM root
  └── package.json         → Dependencies
```

---

## 🔑 Key Files to Know

| File | Purpose | When to Edit |
|------|---------|--------------|
| `server/.env` | Config | Add secrets, API keys |
| `server/server.js` | Main server | Add routes, middleware |
| `server/models/*.js` | Database schemas | Add/modify data structure |
| `server/routes/*.js` | API endpoints | Add new endpoints |
| `server/controllers/*.js` | Business logic | Implement features |
| `client/src/services/api.js` | API client | Add new API methods |
| `client/src/contexts/*.js` | Global state | Manage state |
| `client/src/pages/*.jsx` | Pages | Create new pages |

---

## 📦 Important Dependencies

### Backend
```json
{
  "express": "REST API framework",
  "mongoose": "MongoDB ODM",
  "jwt": "Authentication tokens",
  "bcryptjs": "Password hashing",
  "cors": "Cross-origin requests",
  "dotenv": "Environment variables",
  "razorpay": "Payment gateway",
  "nodemailer": "Email service",
  "socket.io": "Real-time updates"
}
```

### Frontend
```json
{
  "react": "UI library",
  "react-router-dom": "Routing",
  "axios": "HTTP client",
  "tailwindcss": "Styling",
  "framer-motion": "Animations",
  "lucide-react": "Icons",
  "react-hot-toast": "Notifications",
  "@tanstack/react-query": "Data fetching"
}
```

---

## 🐛 Debugging Tips

### Browser Console
```javascript
// Check current user
JSON.parse(localStorage.getItem('user'))

// Check auth token
localStorage.getItem('token')

// Make API call from console
fetch('http://localhost:5000/api/shops/nearby?lat=18.5&lng=73.8', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
}).then(r => r.json()).then(console.log)
```

### Backend Debugging
```bash
# Check server logs
npm run dev

# Test API endpoint
curl http://localhost:5000/
curl http://localhost:5000/api/test-db

# Check database
mongosh "your_mongodb_uri"
> use mahii_db
> db.users.find()
```

### Database Queries
```javascript
// In MongoDB Atlas or mongosh
// Count documents
db.users.countDocuments()
db.orders.countDocuments()

// Find specific user
db.users.findOne({ email: 'test@example.com' })

// Find orders for user
db.orders.find({ customer: ObjectId('...') })

// Recent orders
db.orders.find().sort({ createdAt: -1 }).limit(10)
```

---

## 🚨 Common Errors & Fixes

### "Cannot find module 'lucide-react'"
```bash
npm install lucide-react
```

### "MongoDB connection failed"
- Check `.env` has correct `MONGODB_URI`
- Verify IP whitelist in MongoDB Atlas
- Test: `mongosh "your_uri"`

### "CORS error"
- Backend has CORS enabled
- Check frontend API URL in `client/src/services/api.js`
- Should point to `http://localhost:5000/api` (dev)

### "401 Unauthorized"
- Login first to get token
- Token stored in localStorage
- Check Authorization header has "Bearer " prefix

### "Payment not working"
- Check RAZORPAY_KEY_ID and SECRET in `.env`
- Using test keys? (rzp_test_...)
- Browser console for payment errors

### "Port already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Mac/Linux
lsof -i :5000
kill -9 <process_id>
```

---

## 🔒 Security Checklist

- [ ] JWT token in Authorization header (not query string or cookie)
- [ ] Password hashed with bcryptjs
- [ ] Sensitive data in `.env` (never in code)
- [ ] CORS configured for allowed origins only
- [ ] Rate limiting on auth endpoints
- [ ] Input validation on all endpoints
- [ ] HTTPS in production
- [ ] MongoDB connection string includes `?ssl=true` for production

---

## 📊 Database Relationships Quick View

```
User (1) ──────────── (M) Order, Subscription, Payment, Review
Shop (1) ──────────── (M) Product, Order, Subscription, Review
Order (1) ─────────── (1) Payment
Subscription (1) ──── (M) Attendance Records
Product (1) ──────── (M) Order Item
```

---

## 🎨 Frontend Component Patterns

### Context Usage
```javascript
import { useAuth } from '../contexts/AuthContext';

export function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) return <LoginPrompt />;
  return <div>Hello {user.name}</div>;
}
```

### API Call Pattern
```javascript
import { shopAPI } from '../services/api';
import { useState, useEffect } from 'react';

export function ShopsList() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    shopAPI.getNearbyShops({ lat: 18.52, lng: 73.85 })
      .then(res => setShops(res.data.shops))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return <div>Loading...</div>;
  return <div>{shops.map(shop => ...)}</div>;
}
```

### Toast Notification
```javascript
import toast from 'react-hot-toast';

// Success
toast.success('Order placed successfully!');

// Error
toast.error('Failed to place order');

// Loading
const { promise } = toast.promise(
  fetchData(),
  { loading: 'Loading...', success: 'Success!', error: 'Error' }
);
```

---

## ⚙️ Environment Setup

### .env Template
```env
# server/.env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
EMAIL_USER=email@gmail.com
EMAIL_PASS=app_password
```

### .env in Frontend (if needed)
```env
# client/.env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📱 Testing Workflow

1. **Register**: Go to signup page
2. **Login**: Use registered credentials
3. **Browse**: Explore nearby shops
4. **Order**: Create test order (use test payment card)
5. **Subscribe**: Try subscription feature
6. **Admin**: Check admin panel (if role=admin)

**Test Payment Card:**
- Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

---

## 📚 Quick Search Tips

**Looking for...** | **Check this file**
---|---
API endpoint | `README.md` → API Documentation
Database structure | `docs/DATABASE_SCHEMA.md`
Component hierarchy | `docs/ARCHITECTURE.md`
How to deploy | `docs/DEPLOYMENT.md`
Setup issues | `docs/GETTING_STARTED.md`
Controller logic | `server/controllers/`
React page code | `client/src/pages/`
API methods | `client/src/services/api.js`

---

## 🔗 Useful Links

- **MongoDB Atlas**: https://cloud.mongodb.com
- **Razorpay Dashboard**: https://dashboard.razorpay.com
- **GitHub**: [your-repo-url]
- **Project Docs**: `/docs` folder
- **API Base**: `http://localhost:5000/api`

---

## 💡 Pro Tips

1. **Use Postman** to test APIs before frontend integration
2. **Check MongoDB Atlas** directly for data verification
3. **Console.log in controllers** to debug business logic
4. **DevTools Network tab** to see actual API calls
5. **React DevTools** extension for component debugging
6. **Lighthouse** for performance auditing
7. **CORS issue?** It's usually URL mismatch, check carefully

---

**Quick Reference Last Updated:** April 2026
**Version:** 1.0
