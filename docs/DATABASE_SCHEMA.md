# 📊 Database Schema Documentation

Comprehensive guide to all MongoDB collections and their relationships.

---

## Collections Overview

| Collection | Purpose | Records Type |
|-----------|---------|--------------|
| users | User authentication & profiles | Customers, Shop Owners, Admins |
| shops | Food establishment details | Mess, Cafe, Hotel, Stalls |
| products | Food items & menu items | Individual products per shop |
| orders | Customer orders | Purchase transactions |
| subscriptions | Monthly meal plans | Recurring subscriptions |
| payments | Payment records | Transaction records |
| notifications | User notifications | System & email notifications |
| contacts | Contact form submissions | Support inquiries |
| reviews | Product & shop reviews | User feedback |
| attendance | Subscription attendance | Attendance tracking |

---

## 1. Users Collection

**Purpose:** Store user authentication and profile information

**Schema:**
```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["customer", "shopowner", "admin"],
    default: "customer"
  },
  
  // Customer specific fields
  college: String,
  location: String,
  dietaryPreferences: [String], // ["vegetarian", "vegan", etc]
  
  // Shop Owner specific fields
  shopDetails: {
    shopId: ObjectId,
    businessName: String,
    businessType: String,
    panNumber: String,
    gstnNumber: String
  },
  
  // Profile
  avatar: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpiry: Date,
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: String,
  
  // Two-factor auth
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
  
  // Preferences
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      enum: ["en", "mr"],
      default: "en"
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light"
    }
  },
  
  // Metadata
  loginCount: {
    type: Number,
    default: 0
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
```javascript
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ phone: 1 });
db.users.createIndex({ role: 1 });
db.users.createIndex({ createdAt: -1 });
```

---

## 2. Shops Collection

**Purpose:** Store shop/establishment information

**Schema:**
```javascript
{
  _id: ObjectId,
  owner: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  
  // Basic Info
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["mess", "cafe", "hotel", "desserts", "stalls"],
    required: true
  },
  description: String,
  
  // Location
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    default: "Pune"
  },
  nearbyLandmarks: [String],
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  
  // Operating Details
  openingHours: String, // "6:00 AM - 10:00 PM"
  closedDays: [String], // ["Sunday"]
  cuisineType: [String], // ["Indian", "Continental", "Jain"]
  
  // Business Details
  phone: {
    type: String,
    required: true
  },
  email: String,
  website: String,
  upiId: String,
  
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date,
  licenseNumber: String,
  
  // Ratings & Reviews
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  averageDeliveryTime: Number, // in minutes
  
  // Media
  images: [String], // Array of image URLs
  logo: String,
  banner: String,
  
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  monthlyOrderCount: Number,
  monthlySubscriberCount: Number,
  totalSubscribers: Number,
  
  // Features
  offerDelivery: {
    type: Boolean,
    default: false
  },
  acceptSubscription: {
    type: Boolean,
    default: false
  },
  acceptPayments: {
    type: Boolean,
    default: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Geospatial Index:**
```javascript
db.shops.createIndex({ "location": "2dsphere" });
```

---

## 3. Products Collection

**Purpose:** Store food items/menu items for each shop

**Schema:**
```javascript
{
  _id: ObjectId,
  shop: {
    type: ObjectId,
    ref: "Shop",
    required: true
  },
  
  // Basic Info
  name: {
    type: String,
    required: true
  },
  description: String,
  category: String, // "breakfast", "lunch", "dinner", "snacks", "beverages"
  
  // Pricing
  price: {
    type: Number,
    required: true
  },
  mrp: Number, // Maximum retail price (original price)
  discount: Number, // Percentage discount
  discountedPrice: Number, // Auto-calculated
  
  // Nutritional Info
  calories: Number,
  protein: String, // "15g"
  carbs: String,
  fat: String,
  
  // Dietary Info
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  glutenFree: {
    type: Boolean,
    default: false
  },
  allergens: [String], // ["peanuts", "dairy"]
  
  // Inventory
  quantity: {
    type: Number,
    default: 0 // 0 = unlimited
  },
  available: {
    type: Boolean,
    default: true
  },
  
  // Media
  image: String, // Product image URL
  images: [String], // Multiple images
  
  // Ratings
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  
  // Popularity
  orderCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  
  // Metadata
  isSpicy: {
    type: Boolean,
    default: false
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
```javascript
db.products.createIndex({ shop: 1 });
db.products.createIndex({ category: 1 });
db.products.createIndex({ available: 1 });
db.products.createIndex({ isVegetarian: 1 });
db.products.createIndex({ isBestseller: 1 });
```

---

## 4. Orders Collection

**Purpose:** Store customer orders

**Schema:**
```javascript
{
  _id: ObjectId,
  customer: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  shop: {
    type: ObjectId,
    ref: "Shop",
    required: true
  },
  
  // Order Items
  items: [{
    product: {
      type: ObjectId,
      ref: "Product"
    },
    name: String,
    quantity: Number,
    price: Number, // Price at time of order
    subtotal: Number
  }],
  
  // Totals
  subtotal: Number,
  taxAmount: Number,
  deliveryFee: Number,
  discount: Number,
  totalAmount: {
    type: Number,
    required: true
  },
  
  // Delivery Details
  deliveryType: {
    type: String,
    enum: ["pickup", "delivery"],
    default: "delivery"
  },
  deliveryAddress: String,
  deliveryCoordinates: {
    type: [Number],
    default: null
  },
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  
  // Payment
  paymentMethod: {
    type: String,
    enum: ["razorpay", "upi", "cash"],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending"
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  
  // Status
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled", "returned"],
    default: "pending"
  },
  statusHistory: [{
    status: String,
    timestamp: Date,
    notes: String
  }],
  
  // Additional Details
  customerNotes: String,
  shopNotes: String,
  rating: Number,
  review: String,
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
}
```

**Indexes:**
```javascript
db.orders.createIndex({ customer: 1, createdAt: -1 });
db.orders.createIndex({ shop: 1, createdAt: -1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ paymentStatus: 1 });
db.orders.createIndex({ createdAt: -1 });
```

---

## 5. Subscriptions Collection

**Purpose:** Store meal subscription plans

**Schema:**
```javascript
{
  _id: ObjectId,
  customer: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  shop: {
    type: ObjectId,
    ref: "Shop",
    required: true
  },
  
  // Plan Details
  plan: {
    name: String, // "Basic", "Premium", "Premium+"
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "lunch_dinner", "full_day"],
      required: true
    },
    daysPerWeek: Number, // 5, 6, 7
    mealsPerDay: Number,
    pricePerMonth: Number
  },
  
  // Duration
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  duration: {
    type: String,
    enum: ["1month", "3months", "6months", "1year"]
  },
  autoRenewal: {
    type: Boolean,
    default: false
  },
  
  // Payment
  totalPrice: Number,
  paidAmount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  paymentDate: Date,
  razorpayPaymentId: String,
  
  // Status
  status: {
    type: String,
    enum: ["pending", "active", "paused", "cancelled", "expired"],
    default: "pending"
  },
  cancellationReason: String,
  cancelledAt: Date,
  pausedAt: Date,
  
  // Attendance
  attendanceRecords: [{
    date: Date,
    attended: Boolean,
    markedAt: Date
  }],
  totalDaysAttended: {
    type: Number,
    default: 0
  },
  attendancePercentage: Number,
  
  // Customization
  preferences: {
    spicyLevel: String, // "mild", "medium", "spicy"
    allergies: [String],
    dislikedItems: [String],
    specialRequests: String
  },
  
  // Notifications
  notifyBefore: Number, // days before renewal
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  activatedAt: Date
}
```

**Indexes:**
```javascript
db.subscriptions.createIndex({ customer: 1, status: 1 });
db.subscriptions.createIndex({ shop: 1, status: 1 });
db.subscriptions.createIndex({ status: 1, startDate: 1 });
```

---

## 6. Payments Collection

**Purpose:** Track all payment transactions

**Schema:**
```javascript
{
  _id: ObjectId,
  customer: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  
  // Payment Link
  orderId: {
    type: ObjectId,
    ref: "Order"
  },
  subscriptionId: {
    type: ObjectId,
    ref: "Subscription"
  },
  
  // Amount Details
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "INR"
  },
  
  // Payment Gateway
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  
  // Payment Method
  method: {
    type: String,
    enum: ["razorpay", "upi", "card", "netbanking", "wallet", "cash"],
    required: true
  },
  cardDetails: {
    last4: String,
    brand: String // "Visa", "Mastercard", etc.
  },
  
  // Status
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded", "partially_refunded"],
    default: "pending"
  },
  
  // Refund
  refundable: Boolean,
  refundAmount: Number,
  refundReason: String,
  refundedAt: Date,
  
  // Invoice
  invoiceNumber: String,
  invoiceUrl: String,
  
  // Metadata
  description: String,
  notes: String,
  failureReason: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
}
```

**Indexes:**
```javascript
db.payments.createIndex({ customer: 1, createdAt: -1 });
db.payments.createIndex({ status: 1 });
db.payments.createIndex({ razorpayPaymentId: 1 }, { unique: true });
```

---

## 7. Notifications Collection

**Purpose:** Store user notifications

**Schema:**
```javascript
{
  _id: ObjectId,
  recipient: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  
  // Notification Type
  type: {
    type: String,
    enum: ["order_confirmed", "order_ready", "order_delivered", "subscription_activated", "subscription_expiring", "subscription_expired", "payment_received", "review_request", "promotion", "system"],
    required: true
  },
  
  // Content
  title: String,
  message: String,
  description: String,
  
  // Related Entity
  relatedEntity: {
    entityType: String, // "order", "subscription", "payment"
    entityId: ObjectId
  },
  
  // Status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  
  // Channels
  channels: {
    inApp: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    }
  },
  
  // Email Metadata
  emailSent: Boolean,
  emailSentAt: Date,
  emailBounced: Boolean,
  
  // Action
  actionUrl: String,
  actionText: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
```javascript
db.notifications.createIndex({ recipient: 1, createdAt: -1 });
db.notifications.createIndex({ recipient: 1, isRead: 1 });
```

---

## 8. Reviews Collection

**Purpose:** Store product and shop reviews

**Schema:**
```javascript
{
  _id: ObjectId,
  reviewer: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  
  // Reviewed Entity
  entityType: {
    type: String,
    enum: ["product", "shop"]
  },
  entityId: {
    type: ObjectId,
    required: true
  },
  
  // Order Reference
  order: {
    type: ObjectId,
    ref: "Order"
  },
  
  // Rating
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  
  // Content
  title: String,
  comment: String,
  
  // Aspects
  foodQuality: Number,
  delivery: Number,
  packaging: Number,
  
  // Media
  images: [String],
  
  // Meta
  verified: Boolean,
  helpful: Number, // Count of helpful votes
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

---

## Data Relationships Diagram

```
User (1) ──────────────────── (Many) Order
  │                              │
  │                              ├─> Shop
  │                              └─> Product
  │
  ├──────────────────────── (Many) Subscription
  │                              │
  │                              ├─> Shop
  │                              └─> Plan
  │
  ├──────────────────────── (Many) Payment
  │                              │
  │                              ├─> Order
  │                              └─> Subscription
  │
  ├──────────────────────── (Many) Notification
  │
  └──────────────────────── (Many) Review
                                 │
                                 └─> Product/Shop

Shop (1) ──────────────────── (Many) Product
  │                          
  ├─────────────────────── (Many) Order
  │
  ├─────────────────────── (Many) Subscription
  │
  └─────────────────────── (Many) Review
```

---

**Schema Last Updated:** April 2026
