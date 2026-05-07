# 🏗️ Architecture Guide

This document outlines the system architecture of Mahii.

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│                    (React Application)                           │
│                    (http://localhost:3000)                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    (HTTP/REST API Calls)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    EXPRESS.JS SERVER                             │
│                (http://localhost:5000/api)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Middleware Stack                            │  │
│  │  ┌─────────────┐ ┌────────────┐ ┌─────────────────┐    │  │
│  │  │   Helmet    │ │   CORS     │ │ Rate Limiting  │    │  │
│  │  └─────────────┘ └────────────┘ └─────────────────┘    │  │
│  │       ┌─────────────────────┐                          │  │
│  │       │  Authentication      │                          │  │
│  │       │  (JWT Middleware)    │                          │  │
│  │       └─────────────────────┘                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Route Handlers                        │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────┐    │  │
│  │  │  Auth  │ │ Shops  │ │Orders  │ │Subscriptions│    │  │
│  │  └────────┘ └────────┘ └────────┘ └──────────────┘    │  │
│  │  ┌────────┐ ┌────────┐ ┌──────────────────────────┐   │  │
│  │  │Payments│ │Products│ │  Notifications/Admin   │   │  │
│  │  └────────┘ └────────┘ └──────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 Business Logic Layer                     │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │           Controllers (Business Logic)             │ │  │
│  │  │  - authController  - subscriptionController       │ │  │
│  │  │  - shopController  - paymentController           │ │  │
│  │  │  - orderController - notificationController      │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │              Services Layer                         │ │  │
│  │  │  - razorpayService (Payment Processing)           │ │  │
│  │  │  - emailService (Notifications)                   │ │  │
│  │  │  - validationService (Data Validation)            │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Data Access Layer                    │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │          MongoDB Models (Schemas)               │  │  │
│  │  │  - User       - Order      - Payment           │  │  │
│  │  │  - Shop       - Subscription - Notification    │  │  │
│  │  │  - Product    - Contact     - Admin            │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│  MongoDB Atlas │  │  Razorpay API   │  │  Gmail SMTP    │
│                │  │                 │  │                │
│  - User Data   │  │ - Payment       │  │ - Email Notif. │
│  - Orders      │  │ - Verification  │  │ - OTP Sending  │
│  - Subscriptions │ │ - Refunds      │  │                │
│  - Products    │  │                 │  │                │
│  - Reviews     │  │                 │  │                │
└────────────────┘  └─────────────────┘  └────────────────┘
```

---

## Client-Side Architecture

### Component Hierarchy

```
App.js (Root Component)
├── Header/Navbar
│   ├── Logo
│   ├── Search Bar
│   ├── Auth Buttons
│   │   ├── Login Modal
│   │   └── Register Modal
│   └── User Menu (if logged in)
│
├── Main Content (Routing)
│   ├── Home Page
│   │   ├── Hero Section
│   │   ├── Featured Shops
│   │   ├── Categories
│   │   └── Testimonials
│   │
│   ├── Explore Page
│   │   ├── Filters
│   │   ├── Shop List
│   │   └── Map View
│   │
│   ├── Shop Pages
│   │   ├── MessPage
│   │   ├── CafePage
│   │   └── HotelPage
│   │
│   ├── Cart/Checkout
│   │   ├── Cart Items
│   │   ├── Order Summary
│   │   └── Payment Form
│   │
│   ├── Orders
│   │   ├── Active Orders
│   │   ├── Order History
│   │   └── Order Details
│   │
│   ├── Subscriptions
│   │   ├── Available Plans
│   │   ├── My Subscriptions
│   │   └── Attendance Tracker
│   │
│   ├── Admin Panel
│   │   ├── Dashboard
│   │   ├── Users
│   │   ├── Shops
│   │   └── Analytics
│   │
│   └── Auth Pages
│       ├── Login
│       └── Register
│
├── Sidebar/Navigation
│
├── Footer
│   ├── Quick Links
│   ├── Social Media
│   └── Contact Info
│
└── Global Modals/Toasts
    ├── Toast Notifications
    ├── Confirmation Dialogs
    └── Error Messages
```

### State Management

**Context API Hierarchy:**
```
AuthContext
├── currentUser
├── token
├── isAuthenticated
├── login()
├── logout()
└── register()

CartContext
├── items[]
├── totalAmount
├── addItem()
├── removeItem()
├── updateQuantity()
└── checkout()

ThemeContext
├── isDarkMode
├── toggleTheme()
└── theme settings
```

### Data Flow

```
User Interaction
    │
    ▼
React Component (Event Handler)
    │
    ▼
API Service Call (axios)
    │
    ├─► Request Interceptor
    │   └─► Add JWT Token
    │
    ▼
Express Server
    │
    ├─► Auth Middleware (Verify Token)
    │
    ├─► Route Handler
    │
    ├─► Controller (Business Logic)
    │
    ├─► MongoDB Query
    │
    └─► Response
    │
    ├─► Response Interceptor
    │   └─► Handle Errors
    │
    ▼
Update React State (Context/useState)
    │
    ▼
Component Re-render
    │
    ▼
Update UI
```

---

## Backend Architecture

### Request Processing Flow

```
HTTP Request
    │
    ▼
Express Middleware Stack
    ├─ Helmet (Security Headers)
    ├─ CORS (Cross-Origin Validation)
    ├─ Body Parser (JSON Processing)
    ├─ Rate Limiter (DDoS Protection)
    └─ Authentication (JWT Verification)
    │
    ▼
Route Handler
    │
    ▼
Controller
    ├─ Validate Input
    ├─ Call Services/Models
    ├─ Handle Business Logic
    └─ Format Response
    │
    ▼
Service Layer (if needed)
    ├─ Razorpay Integration
    ├─ Email Sending
    ├─ Data Transformation
    └─ External API Calls
    │
    ▼
Database (MongoDB)
    ├─ Query Execution
    ├─ Document Validation
    ├─ Index Usage
    └─ Transaction Management
    │
    ▼
Response Object
    │
    ▼
Client (JSON Response)
```

### Authentication Flow

```
User Login
    │
    ▼
POST /api/auth/login
    ├─ Receive email + password
    │
    ▼
Find User in Database
    │
    ├─ Not found → Return 404
    │
    ▼
Compare Passwords (bcryptjs)
    │
    ├─ Not match → Return 401
    │
    ▼
Generate JWT Token
    ├─ Payload: user._id, email, role
    ├─ Secret: JWT_SECRET
    ├─ Expiry: 7 days
    │
    ▼
Return { token, user }
    │
    ▼
Client stores token in localStorage
    │
    ▼
Subsequent Requests
    ├─ Include Authorization header
    ├─ Server verifies JWT
    └─ Attach user to request object
```

### Database Relationships

```
User (1) ─────────────── (Many) Order
   │                          │
   │                          ├─→ Product
   │                          └─→ Shop
   │
   └─────────────────────── (Many) Subscription
                                   │
                                   ├─→ Shop
                                   ├─→ Product
                                   └─→ Attendance Records

Shop (1) ───────────────── (Many) Product
   │
   ├───────────────────── (Many) Order
   │
   ├───────────────────── (Many) Review
   │
   └───────────────────── (Many) Subscription

Payment (1) ─────── (1) Order or Subscription
```

---

## API Communication Pattern

### Request Structure
```
{
  method: "GET|POST|PUT|DELETE|PATCH",
  url: "http://localhost:5000/api/endpoint",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer <jwt_token>"
  },
  data: {
    // payload
  }
}
```

### Response Structure (Success)
```json
{
  "success": true,
  "data": {
    // response data
  },
  "message": "Operation successful"
}
```

### Response Structure (Error)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format"
  },
  "statusCode": 400
}
```

---

## Security Architecture

### Authentication & Authorization
```
1. Password Security
   └─ bcryptjs (salted hashing)

2. Token Security
   ├─ JWT (JSON Web Tokens)
   ├─ 7-day expiration
   └─ Secure storage in localStorage

3. API Security
   ├─ Helmet (Security headers)
   ├─ CORS (Controlled origins)
   ├─ Rate Limiting (Brute force protection)
   └─ Input Validation

4. Data Security
   ├─ MongoDB encryption at rest
   ├─ SSL/TLS in transit
   └─ Environment variables for secrets
```

---

## Performance Optimization

### Frontend
- Code splitting with React Router
- Lazy loading of components
- Image optimization
- Caching with localStorage
- Memoization with React.memo

### Backend
- MongoDB indexes on frequently queried fields
- Query optimization
- Response compression
- Caching strategies
- Database connection pooling

### Network
- CORS optimization
- HTTP/2 support
- Gzip compression
- CDN for static assets (in production)

---

## Deployment Architecture (Production)

```
User
  │
  ▼
Cloudflare/CDN (Static Assets)
  │
  ▼
Nginx Reverse Proxy
  │
  ├─→ http://localhost:3000 (React built files)
  │
  └─→ http://localhost:5000 (Express API)
       │
       ▼
    Load Balancer (Multiple servers)
       │
       ├─→ Express Server 1
       ├─→ Express Server 2
       └─→ Express Server N
           │
           ▼
        MongoDB Atlas (Managed Database)
```

---

## Monitoring & Logging

```
Frontend
├─ Error logging (Sentry)
├─ Performance monitoring
└─ User analytics

Backend
├─ Request logging (Morgan)
├─ Error tracking
├─ Performance metrics
└─ Database query logging

Infrastructure
├─ Server uptime monitoring
├─ Database performance
├─ API response times
└─ Error rates
```

---

## Technology Justifications

| Component | Technology | Reason |
|-----------|-----------|--------|
| Frontend | React | Component-based, large community, fast rendering |
| Backend | Express.js | Lightweight, flexible, industry standard |
| Database | MongoDB | Flexible schema, scalable, easy to use |
| Authentication | JWT | Stateless, secure, RESTful best practice |
| Payment | Razorpay | India-focused, reliable, easy integration |
| Styling | Tailwind CSS | Utility-first, responsive, fast development |
| Icons | Lucide React | Lightweight, accessible, customizable |
| Animation | Framer Motion | Smooth animations, React-native support |

---

**Architecture Last Updated:** April 2026
