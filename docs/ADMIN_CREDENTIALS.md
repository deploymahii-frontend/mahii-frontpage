# 🔐 Admin Credentials & Setup

Quick reference for admin account setup and login credentials.

---

## 📧 Default Admin Account Credentials

```
Email:      admin@mahii.dev
Password:   NewAdmin@2026!
```

---

## ⚡ Quick Setup (2 Steps)

### Step 1: Create Admin Account

In project root, open terminal in `server` folder:

```bash
cd server
npm run setup:admin
```

**Expected Output:**
```
🔄 Connecting to MongoDB...
✅ MongoDB Connected: cluster0.mongodb.net
🔍 Checking for existing admin...
👤 Creating admin user...
✅ Admin created successfully!
💫 Email: admin@mahii.dev
🔒 Password: NewAdmin@2026!
⚠️  Please change password after first login!
```

### Step 2: Login

1. Start server and client:
   ```bash
   # Terminal 1 - Server
   cd server && npm run dev
   
   # Terminal 2 - Client
   cd client && npm start
   ```

2. Go to: `http://localhost:3000/login/admin`

3. Enter credentials:
   - **Email**: `admin@mahii.dev`
   - **Password**: `NewAdmin@2026!`

4. Click Login → Access `/admin/dashboard`

---

## 🎯 Admin Features

| Feature | Route | Access |
|---------|-------|--------|
| Admin Portal | `/login/admin` | Public |
| Dashboard | `/admin/dashboard` | Admin only |
| Manage Users | API endpoint | Admin Dashboard |
| Approve Shops | API endpoint | Admin Dashboard |
| View Reports | API endpoint | Admin Dashboard |

---

## 🔑 Admin API Endpoints

```bash
# Dashboard Stats
GET /api/admin/dashboard
Authorization: Bearer {token}

# Users
GET /api/admin/users
GET /api/admin/users/:id
PUT /api/admin/users/:id
DELETE /api/admin/users/:id

# Shops
GET /api/admin/shops
PUT /api/admin/shops/:id/approve

# Reports
GET /api/admin/reports/revenue
```

---

## ✅ Verification Checklist

- [ ] Run `npm run setup:admin` (server folder)
- [ ] Admin created successfully
- [ ] Server running on port 5000
- [ ] Client running on port 3000
- [ ] Go to `http://localhost:3000/login/admin`
- [ ] Login with credentials above
- [ ] Dashboard loads
- [ ] Can view/approve shop owners

---

## 🚨 Troubleshooting

### Admin Won't Login
✗ **Admin doesn't exist** → Run: `npm run setup:admin`
✗ **Wrong password** → Re-run setup script
✗ **Server not running** → Start with `npm run dev`

### Admin Already Exists
```
⚠️  Admin already exists!
```
**This is OK!** Just login with the credentials above.

---

## 📝 See Also

- Full guide: [ADMIN_TESTING.md](../ADMIN_TESTING.md)
- Running guide: [RUNNING_GUIDE.md](../RUNNING_GUIDE.md)
- Stopping guide: [STOPPING_GUIDE.md](../STOPPING_GUIDE.md)

