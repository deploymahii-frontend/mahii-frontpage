# 🔐 Admin Login - Testing Guide

Complete guide for creating and testing admin account.

---

## 📧 Admin Credentials (For Testing)

```
Email:      admin@mahii.dev
Password:   NewAdmin@2026!
Secret Key: swaadsetu_admin_secret_key_2026_newkey
```

**⚠️ IMPORTANT:** Change these credentials and secret key immediately in production!

---

## 🚀 Create Admin Account (One-Time Setup)

### Method 1: Using Node Script (Recommended)

#### Step 1: Add to package.json scripts
```json
"scripts": {
  "setup:admin": "node scripts/create-admin.js"
}
```

#### Step 2: Run the script
```bash
cd server
npm run setup:admin
```

**Output:**
```
🔄 Connecting to MongoDB...
✅ MongoDB Connected: cluster0.mongodb.net
🔍 Checking for existing admin...
👤 Creating admin user...
✅ Admin created successfully!
💫 Email: admin@mahii.dev
🔐 Password: NewAdmin@2026!
⚠️  Please change password after first login!
```

### Method 2: Manual - Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database
3. Navigate to: Database → `mahii` → Collection `users`
4. Insert document:

```json
{
  "name": "Super Admin",
  "email": "admin@mahii.dev",
  "phone": "9999999999",
  "password": "$2a$10$...",  // bcrypted "NewAdmin@2026!"
  "role": "admin",
  "isVerified": true,
  "isApproved": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

### Method 3: Using API (After Server Starts)

Create a temporary endpoint or use a direct database insert.

---

## 🔑 How to Login

### Step 1: Go to Secure Admin Portal
```
http://localhost:3000/secure-admin-portal
```

### Step 2: Enter Secret Key

| Field | Value |
|-------|-------|
| **Secret Key** | swaadsetu_admin_secret_key_2026_newkey |

✅ Click "Verify" to proceed

### Step 3: Enter Admin Credentials

| Field | Value |
|-------|-------|
| **Email** | admin@mahii.dev |
| **Password** | NewAdmin@2026! |

### Step 4: Click Login

### Step 5: Access Admin Dashboard
```
http://localhost:3000/admin/dashboard
```

**Note**: The secret key provides an additional security layer to protect the hidden admin portal.

---

## ✅ Admin Features to Test

### 1. **View Dashboard Stats**
- Total Users
- Pending Shop Owners
- Active Shops
- Total Orders
- Revenue

### 2. **Manage Shop Owners**
- View all shop owner registrations
- Approve/Reject applications
- View shop details
- Block/Unblock users

### 3. **View Shops**
- List all registered shops
- Approve/Reject shops
- View shop details
- View owner information

### 4. **Manage Users**
- View all customers
- View all shop owners
- View all admins
- Search users by email/phone
- Block/Unblock accounts

### 5. **Monitor Orders**
- View all orders
- Filter by status
- View order details
- View customer info

---

## 🧪 Testing Workflows

### Workflow 1: Approve a Shop Owner

1. **Create Shop Owner** (as customer):
   - Go to `/register/shopowner`
   - Fill form and submit
   - Registration successful message
   - `isApproved: false`

2. **Login as Admin**:
   - Go to `/login/admin`
   - Use credentials above
   - Access admin dashboard

3. **Approve Shop Owner**:
   - Navigate to "Shop Owners" section
   - Find the pending registration
   - Click "Approve"
   - Shop owner `isApproved: true`

4. **Test Shop Owner Access**:
   - Shop owner can now login
   - Full dashboard access
   - Can manage products/orders/subscriptions

---

### Workflow 2: Approve a NEW Shop Registration (ShopSetup Flow)

#### 2.1 Create Test Shop
1. **Register as Shop Owner**:
   - Go to `/register/shopowner`
   - Email: `shopowner@test.com`
   - Password: `Test@123`
   - Click Register

2. **Complete Shop Setup** (auto-redirects):
   - Go to `/shop/setup` (should auto-navigate)
   - **Step 1: Shop Details**
     - Name: `Vadapav Express`
     - Category: `Stall`
     - Address: `123 Maharashtra St, Mumbai`
     - Phone: `9876543210`
     - Hours: `10:00 - 22:00`
     - Click "Next"
   
   - **Step 2: Visibility & Approval**
     - Preview shop details
     - Check "Accept Terms"
     - Click "Submit for Approval"
   
   **Result**: Shop created with `isActive: false` (pending)

3. **Add Menu Items** (from ShopDashboard):
   - Go to `/shop/dashboard`
   - Click "Add Menu Item"
   - Product: `Vadapav`
   - Price: `₹20`
   - Category: `Snacks`
   - Veg: `Yes`
   - Click "Save"
   
   **Result**: Product created with `isAvailable: true`

#### 2.2 Admin Approval Process
1. **Login as Admin**:
   - Go to `/secure-admin-portal`
   - Enter Secret Key: `swaadsetu_admin_secret_key_2026_newkey`
   - Enter Email: `admin@mahii.dev`
   - Enter Password: `NewAdmin@2026!`

2. **View Pending Shops**:
   - Dashboard → Shop Management → Pending Approvals
   - OR: Navigate to `/admin/shops/pending`
   - List should show: "Vadapav Express" | Status: Pending | Owner: shopowner@test.com

3. **Approve Shop**:
   - Click "Approve" on "Vadapav Express"
   - Optional: Add remarks
   - Click "Confirm"
   
   **Result**: 
   - Shop status changes to "Active"
   - `isActive: true` is set in database
   - System sends notification to shop owner

#### 2.3 Verification After Approval
1. **Check Explore Page**:
   - Logout as admin
   - Go to `/explore`
   - **Expected**: "Vadapav Express" appears in 🌮 Stall section
   - Show: Cover image, top 3 menu items (or just "Vadapav"), rating badge
   
2. **Check Shop Detail**:
   - Click "View Shop" on Vadapav Express
   - **Expected**: Full shop profile displays
   - Menu shows full list of products added

---

### Workflow 3: Block a User

1. **Login as Admin**
2. **Go to Users Section**
3. **Find user**
4. **Click Block**
5. **Test**: User cannot login anymore

---

### Workflow 4: View Statistics

1. **Admin Dashboard**
   - See total users by role
   - View pending approvals
   - See active shops
   - Monitor revenue

---

## 🐛 Troubleshooting

### Issue: Admin Cannot Login

**Check 1: Invalid Secret Key**
```bash
# Verify secret key on first screen
Log: "Invalid secret key"
Fix: Use correct secret key: swaadsetu_admin_secret_key_2026_newkey
```

**Check 2: User Doesn't Exist**
```bash
# Check MongoDB for admin user
Log: "User not found" or "Invalid credentials"
Fix: Run setup script
```

**Check 3: Wrong Password**
```bash
# Verify password hash
Log: "Invalid credentials"
Fix: Re-create admin with correct hash
```

**Check 4: Role Mismatch**
```bash
# Verify role field
Log: "Access denied. Admin only."
Fix: Ensure role === 'admin'
```

**Check 5: Token Issues**
```bash
# Check JWT_SECRET in .env
Log: "Authentication failed"
Fix: Verify JWT_SECRET is set
```

---

## 🔒 Change Admin Password

### After First Login:

1. **Go to Admin Settings** (if available)
2. **Click "Change Password"**
3. **Enter New Password**
4. **Confirm Changes**

### Or Update Directly in MongoDB:

```javascript
// In MongoDB Compass or MongoDB Shell
db.users.updateOne(
  { email: "admin@mahii.dev" },
  { 
    $set: { 
      password: bcrypt.hashSync("NewPassword123456", 10)
    }
  }
)
```

---

## 📋 Admin API Endpoints (Testing)

### View Dashboard Stats
```
GET /api/admin/dashboard
Authorization: Bearer {token}
```

### Get All Users
```
GET /api/admin/users
Authorization: Bearer {token}
Query: ?role=shopowner&isApproved=false
```

### Approve Shop Owner
```
PUT /api/admin/users/:id
Authorization: Bearer {token}
Body: { isApproved: true }
```

### Get All Shops
```
GET /api/admin/shops
Authorization: Bearer {token}
```

### Approve Shop
```
PUT /api/admin/shops/:shopId/approve
Authorization: Bearer {token}
Body: { isActive: true }
```

---

## 🚨 Security Notes

1. **Never commit real passwords** to version control
2. **Change default password** after first login
3. **Use strong passwords** in production
4. **Enable 2FA** if possible
5. **Rotate credentials** periodically
6. **Monitor admin logs** for suspicious activity

---

## 📞 Quick Reference

| Action | URL | Credentials |
|--------|-----|-------------|
| Admin Login | `/login/admin` | admin@mahii.dev / NewAdmin@2026! |
| Admin Dashboard | `/admin/dashboard` | (After login) |
| Approve Shop Owner | Admin Dashboard | (Find in panel) |
| View All Users | `/api/admin/users` | (API call) |
| Create Admin | `npm run setup:admin` | (Terminal command) |

---

## ✨ Tips for Testing

1. **Use Postman** to test API endpoints directly
2. **Check browser console** for error details
3. **Check server logs** for debug info
4. **Use MongoDB Compass** to verify data changes
5. **Test on multiple browsers** for UI issues
6. **Clear cache** if login not working (browser issue)

---

## 📝 Test Cases Checklist

- [ ] Admin can successfully login
- [ ] Admin dashboard loads with stats
- [ ] Admin can view all users
- [ ] Admin can approve shop owners
- [ ] Admin can reject shop owners
- [ ] Admin can block users
- [ ] Admin can view all shops
- [ ] Admin can view all orders
- [ ] Admin can filter by various criteria
- [ ] Token expires properly
- [ ] Logout clears session
- [ ] Unauthorized users cannot access admin area

---

## 🎯 Next Steps

1. ✅ Create admin account (see steps above)
2. ✅ Login and test dashboard
3. ✅ Test approving a shop owner
4. ✅ Test user management
5. ✅ Verify all features work
6. ✅ Change default password
7. ✅ Update security settings

---

**Happy Testing! 🎉**
