# 📚 Documentation Index

Complete documentation for the Mahii project.

---

## 📖 Main Documentation Files

### 1. **[README.md](../README.md)** - Main Project Documentation
   - Project overview and vision
   - Complete tech stack breakdown
   - Project structure and file organization
   - API documentation with all endpoints
   - Database models reference
   - Feature list
   - Troubleshooting guide

**Best for:** Understanding the whole project, API reference, general overview

---

### 2. **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Setup & Installation Guide
   - Prerequisites checklist
   - Step-by-step setup instructions
   - Environment configuration
   - MongoDB Atlas setup
   - Razorpay integration
   - Running the application
   - Verification checklist
   - First steps in the app
   - Common issues & solutions

**Best for:** New developers, first-time setup, troubleshooting setup issues

---

### 3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System Design & Architecture
   - System architecture overview
   - Client-side component hierarchy
   - State management structure
   - Data flow diagrams
   - Backend architecture
   - Request processing flow
   - Authentication flow
   - Database relationships
   - Security architecture
   - Performance optimization strategies

**Best for:** Understanding system design, developers, architects

---

### 4. **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Database Collections Reference
   - Complete MongoDB schema documentation
   - All 10 collections with detailed fields
   - Data types and relationships
   - Indexes and query optimization
   - Collections overview table
   - Data relationship diagrams

**Best for:** Database developers, data modeling, query writing

---

### 5. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production Deployment Guide
   - Deployment checklist
   - Heroku deployment steps
   - AWS EC2 setup
   - Docker & Kubernetes configuration
   - Environment configuration
   - Database backup strategies
   - SSL/TLS setup
   - Monitoring & analytics integration
   - Performance optimization
   - Scaling strategies
   - CI/CD pipeline setup
   - Disaster recovery plan

**Best for:** DevOps, deployment, production setup

---

### 6. **[ADMIN_LOGIN.md](./ADMIN_LOGIN.md)** - Secure Admin Login Architecture
   - Hidden admin portal flow
   - Secret key + email/password + MFA
   - IP whitelist and rate limiting
   - Session binding and timeout
   - Audit logging and admin invite flow

**Best for:** Admin security, auth flow, backend and frontend integration

---

## 🚀 Quick Start Paths

### For New Developers
1. Start with [README.md](../README.md) for overview
2. Follow [GETTING_STARTED.md](./GETTING_STARTED.md) for setup
3. Check [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the codebase
4. Read [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for data models

### For Backend Developers
1. Review [ARCHITECTURE.md](./ARCHITECTURE.md#backend-architecture)
2. Study [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
3. Check [README.md](../README.md#api-documentation) for API endpoints
4. Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup

### For Frontend Developers
1. Check [ARCHITECTURE.md](./ARCHITECTURE.md#client-side-architecture)
2. Review [README.md](../README.md#api-documentation) for API endpoints
3. Follow [GETTING_STARTED.md](./GETTING_STARTED.md) for local setup

### For DevOps/Deployment
1. Study [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Check [README.md](../README.md#troubleshooting) for issues
3. Review [ARCHITECTURE.md](./ARCHITECTURE.md#deployment-architecture-production)

### For API Integration
1. Read [README.md](../README.md#api-documentation) for all endpoints
2. Check [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for data models
3. Review [README.md](../README.md#authentication-endpoints) for auth

---

## 📋 Cheat Sheet

### Common Commands

**Backend:**
```bash
cd server
npm install              # Install dependencies
npm run dev              # Start development server
npm start                # Start production server
NODE_ENV=production npm start  # Production mode
```

**Frontend:**
```bash
cd client
npm install              # Install dependencies
npm start                # Start dev server
npm run build            # Create production build
npm test                 # Run tests
```

### API Endpoints at a Glance

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/customer/register` | No | Register customer |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/shops/nearby` | Yes | Find nearby shops |
| GET | `/api/products/shop/:id` | Yes | Get shop products |
| POST | `/api/orders` | Yes | Create order |
| GET | `/api/orders/my-orders` | Yes | Get user orders |
| POST | `/api/subscriptions/create` | Yes | Create subscription |
| GET | `/api/subscriptions/my` | Yes | Get subscriptions |
| POST | `/api/payments/verify` | Yes | Verify payment |

### Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://...

# Auth
JWT_SECRET=your_secret
JWT_EXPIRE=7d

# Payments
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# Email
EMAIL_USER=email@gmail.com
EMAIL_PASS=app_password
```

### Database Collections

1. **users** - User accounts
2. **shops** - Food establishments
3. **products** - Menu items
4. **orders** - Customer orders
5. **subscriptions** - Meal plans
6. **payments** - Payment records
7. **notifications** - User notifications
8. **contacts** - Support inquiries
9. **reviews** - User reviews
10. **attendance** - Subscription attendance

---

## 🔗 External Resources

### Official Documentation
- [Node.js Docs](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)
- [MongoDB Docs](https://docs.mongodb.com)
- [Mongoose Guide](https://mongoosejs.com)

### Tools & Services
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Razorpay Integration](https://razorpay.com/integrations)
- [Postman API Testing](https://www.postman.com)
- [GitHub Docs](https://docs.github.com)

### Frontend Libraries
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Framer Motion](https://www.framer.com/motion)
- [Axios](https://axios-http.com)

---

## ❓ FAQ

**Q: Where do I find API documentation?**
A: Check [README.md - API Documentation section](../README.md#api-documentation)

**Q: How do I set up MongoDB?**
A: Follow [GETTING_STARTED.md - Step 1: MongoDB Atlas Setup](./GETTING_STARTED.md#1%EF%B8%8F-mongodb-atlas-setup)

**Q: How do I deploy to production?**
A: See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions

**Q: What are the database tables?**
A: Check [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for all collections

**Q: How do I understand the system design?**
A: Read [ARCHITECTURE.md](./ARCHITECTURE.md)

**Q: What should I do first as a new developer?**
A: Follow the [For New Developers](#for-new-developers) path above

---

## 📞 Support & Contact

- **Documentation Issues:** Check the specific documentation file
- **Setup Problems:** See [GETTING_STARTED.md - Common Issues](./GETTING_STARTED.md#-common-issues--solutions)
- **API Issues:** Check [README.md - API Documentation](../README.md#api-documentation)
- **Deployment Issues:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📝 Documentation Maintenance

| Document | Last Updated | Maintainer | Status |
|----------|--------------|-----------|--------|
| README.md | April 2026 | Team | ✅ Current |
| GETTING_STARTED.md | April 2026 | Team | ✅ Current |
| ARCHITECTURE.md | April 2026 | Team | ✅ Current |
| DATABASE_SCHEMA.md | April 2026 | Team | ✅ Current |
| DEPLOYMENT.md | April 2026 | Team | ✅ Current |

---

**Last Updated:** April 2026
**Version:** 1.0.0
**Status:** Complete ✅
