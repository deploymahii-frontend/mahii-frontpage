# 🚀 Getting Started Guide

This guide will help you set up and run Mahii on your local machine.

## Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org)
- **npm** (comes with Node.js) - verify with `npm -v`
- **MongoDB Atlas Account** - [Create free account](https://www.mongodb.com/cloud/atlas)
- **Razorpay Account** - [Sign up here](https://razorpay.com)
- **Git** (optional) - for version control

---

## Step-by-Step Setup

### 1️⃣ MongoDB Atlas Setup

**Create Database:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click "Create" → Create a new project
4. Select **M0 (Free)** tier
5. Choose your preferred region (closest to you for best performance)
6. Click "Create Cluster"

**Create Database User:**
1. In left sidebar, click **Database Access**
2. Click **Add New Database User**
3. Enter username: `omjaunjal678_db_user`
4. Enter password: Generate a strong password or use provided
5. Select "Read and write to any database"
6. Click **Add User**

**Whitelist IP:**
1. In left sidebar, click **Network Access**
2. Click **Add IP Address**
3. Select **Allow access from anywhere** (for development)
4. Click **Confirm**

**Get Connection String:**
1. Click **Databases** → Click **Connect**
2. Select **Drivers** → Node.js
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `myFirstDatabase` with `mahii_db`

**Example:**
```
mongodb+srv://omjaunjal678_db_user:uzdBymRi7RNozpw8@mahii-cluster.9ex5rfs.mongodb.net/mahii_db?retryWrites=true&w=majority
```

---

### 2️⃣ Razorpay Setup

**Get Test Keys:**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up or log in
3. Go to **Settings** → **API Keys**
4. Copy **Test Key ID** and **Test Key Secret**
5. Store them securely (you'll need them for `.env`)

**Test Mode:**
- All transactions during development are in **Test Mode**
- No real money is charged
- Test cards available: `4111 1111 1111 1111` (Visa, any CVV, any future expiry)

---

### 3️⃣ Backend Installation

```bash
# Navigate to server directory
cd mahii/server

# Install dependencies
npm install

# Create .env file (or update existing)
# On Windows:
copy .env.example .env

# On Mac/Linux:
cp .env.example .env
```

**Configure `.env` file:**
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB - Replace with your connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mahii_db?retryWrites=true&w=majority

# JWT
JWT_SECRET=mahii_super_secret_key_2024_omjaunjal
JWT_EXPIRE=7d

# Razorpay - Replace with your test keys
RAZORPAY_KEY_ID=rzp_test_SbnEjIRoxraayw
RAZORPAY_KEY_SECRET=ppVmZZWsdDZc9p9JBSXIJSmS

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# OTP Settings
OTP_EXPIRE_MINUTES=5
```

**Gmail App Password Setup:**
1. Go to [Google Account](https://myaccount.google.com)
2. Click **Security** → Enable 2-Step Verification
3. Go back to **Security** → **App passwords**
4. Select **Mail** → **Windows Computer** (or your device)
5. Copy the generated 16-character password
6. Use this as `EMAIL_PASS` in `.env`

---

### 4️⃣ Frontend Installation

```bash
# Navigate to client directory
cd mahii/client

# Install dependencies
npm install

# Verify lucide-react is installed (icon library)
npm install lucide-react

# Check that react-scripts is installed
npm list react-scripts
```

**Verify dependencies:**
```bash
npm list react-router-dom tailwindcss axios framer-motion
```

All should show version numbers ✅

---

### 5️⃣ Running the Application

**Option A: Development Mode (Separate Terminals)**

**Terminal 1 - Start Backend:**
```bash
cd mahii/server
npm run dev

# Expected output:
# 🚀 Server running on http://localhost:5000
# ✅ MongoDB Connected: mahii-cluster.9ex5rfs.mongodb.net
```

**Terminal 2 - Start Frontend:**
```bash
cd mahii/client
npm start

# Expected output:
# On Your Network: http://localhost:3000
# Press q to quit, r to reload
```

**Browser will auto-open:** `http://localhost:3000`

---

**Option B: Production Build**

```bash
# Build frontend
cd mahii/client
npm run build

# Navigate to server
cd ../server

# Start server in production
NODE_ENV=production npm start

# Open browser: http://localhost:5000
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Client compiles without warnings
- [ ] Can access http://localhost:3000 in browser
- [ ] Can create user account
- [ ] Can view shops/products
- [ ] API calls work (check Network tab in DevTools)

---

## 🔍 Testing API Endpoints

**Test Server Connection:**
```bash
# In your terminal or Postman
curl http://localhost:5000/
# Should return: { "success": true, "message": "Mahii API is running!" }
```

**Test Database:**
```bash
curl http://localhost:5000/api/test-db
# Should return: { "success": true, "message": "Database connected!" }
```

**Test User Registration:**
```bash
curl -X POST http://localhost:5000/api/auth/customer/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123",
    "phone": "9876543210",
    "college": "XYZ University"
  }'
```

---

## 📱 First Steps in App

1. **Register** as a customer
2. **Explore** nearby shops
3. **Browse** products
4. **Add to cart** and place order
5. **Try subscriptions** feature
6. **View orders** and history

---

## 🐛 Common Issues & Solutions

### "Cannot find module 'lucide-react'"
```bash
cd client
npm install lucide-react
```

### "MongoDB connection failed"
- Check `.env` file has correct MONGODB_URI
- Verify IP whitelist in MongoDB Atlas
- Ensure you're connected to internet

### "API calls returning 401 Unauthorized"
- Make sure you're logged in
- Check if token is stored in localStorage
- Try logging out and logging back in

### "Razorpay payment not working"
- Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in `.env`
- Make sure you're using test keys, not live keys
- Check browser console for payment errors

### Port 3000 or 5000 already in use
```bash
# Windows - Kill process using port
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux - Kill process using port
lsof -i :3000
kill -9 <PID>
```

---

## 📚 Next Steps

- Read [API Documentation](API_DOCUMENTATION.md)
- Check [Architecture Guide](ARCHITECTURE.md)
- Review [Database Schema](DATABASE_SCHEMA.md)
- See [Deployment Guide](DEPLOYMENT.md)

---

**Need Help?** 
- Check the [main README](../README.md)
- Review error messages carefully
- Check console logs in browser and terminal
- Refer to official docs: [React](https://react.dev), [Node.js](https://nodejs.org/docs), [MongoDB](https://docs.mongodb.com)

---

**Happy Coding! 🚀**
