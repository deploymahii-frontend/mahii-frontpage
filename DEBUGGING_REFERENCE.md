# 🔍 Debugging Reference Guide - Shop Feature

Quick reference for identifying and fixing common issues during testing.

---

## 🎯 Issue Detection Flowchart

```
START
  ↓
[Is Shop Pending?]
  ├─ YES → Go to ADMIN_APPROVAL
  ├─ NO → [Is isActive: true?]
          ├─ YES → [Does shop appear on Explore?]
          │        ├─ YES → SUCCESS
          │        ├─ NO → Go to API_RESPONSE
          ├─ NO → [Is shop in database?]
                  ├─ YES → Go to APPROVAL_STATUS
                  ├─ NO → Go to REGISTRATION_FAILURE
```

---

## 🐛 Common Errors & Fixes

### Error 1: "Cannot find route /shop/setup"

**Symptom:** Blank page or 404 when visiting `/shop/setup`

**Quick Fix:**
1. Check file exists: `client/src/pages/shopowner/ShopSetup.jsx`
2. Check import in `client/src/App.js`:
   ```javascript
   import ShopSetup from './pages/shopowner/ShopSetup';
   ```
3. Check route exists in App.js:
   ```javascript
   <Route path="/shop/setup" element={<ProtectedRoute...><ShopSetup /></ProtectedRoute>} />
   ```

**Debug:**
```javascript
// In browser console
fetch('/shop/setup').then(r => r.status)
// Should NOT be 404
```

---

### Error 2: "Shop doesn't appear on Explore"

**Symptom:** Shop is created and approved, but doesn't show on `/explore`

**Root Causes Hierarchy:**

#### Check 1: Is shop approved?
```javascript
// MongoDB Compass
db.shops.findOne({ name: "Vadapav Express" })
// MUST have: { isActive: true, approvedAt: ISODate(...) }
```
**Fix:** Use [ADMIN_TESTING.md Workflow 2](../ADMIN_TESTING.md#workflow-2-approve-a-new-shop-registration-shopsetup-flow) to approve

#### Check 2: API returning correct data?
```bash
# Open browser developer tools (F12)
curl http://localhost:5000/api/shops
# Response should include your shop with isActive: true
```
**Fix:** If not in response, go back to Check 1

#### Check 3: Frontend code fetching correctly?
```javascript
// In browser console on /explore
fetch('/api/shops').then(r => r.json()).then(d => {
  console.log('Total shops:', d.count);
  console.log('Shops:', d.shops);
  const shop = d.shops.find(s => s.name.includes('Vadapav'));
  console.log('Our shop:', shop);
})
```
**Fix:** If not found, go back to Check 2

#### Check 4: Frontend rendering?
```javascript
// Press F12 in browser, go to Elements tab
// Search for "Vadapav"
// Should find HTML element with shop name
```
**Fix:** If not found, there's a rendering issue - check React console for errors

---

### Error 3: "Menu items don't show in preview on Explore"

**Symptom:** Shop appears but menu preview is empty or shows "No items"

**Check 1: Are products created?**
```javascript
// MongoDB Compass
db.products.find({ shopId: ObjectId("5f7d6c4a3b2a1e9d8c7b6a5f") })
// Replace ObjectId with your shop's _id
// Should show all products you created
```

**Check 2: Do products have correct data?**
```javascript
// Each product must have:
{
  name: "Vadapav",
  price: 20,
  shopId: ObjectId("..."),  // Must match shop._id exactly
  isAvailable: true,         // Must be true to show
  category: "Snacks"
}
```
**Fix:** If missing fields, re-add products from shop dashboard

**Check 3: API returning products?**
```bash
# Replace with actual shopId
curl http://localhost:5000/api/products/shop/5f7d6c4a3b2a1e9d8c7b6a5f
# Should return array with 3+ products
```
**Fix:** If empty, go back to Check 1

**Check 4: Frontend fetching products?**
```javascript
// In Explore page console
const shopId = "5f7d6c4a3b2a1e9d8c7b6a5f";
fetch(`/api/products/shop/${shopId}`)
  .then(r => r.json())
  .then(d => console.log('Products:', d))
```
**Fix:** If empty array, products don't exist in database

---

### Error 4: "Image upload fails"

**Symptom:** Upload button doesn't work or says "Network error"

**Check 1: File selected?**
- Make sure you actually selected a file
- File should be image format (.jpg, .png)
- File should be < 5MB

**Check 2: Server logs**
```bash
# Check terminal where "npm run dev" runs
# Look for errors like:
# - "CLOUDINARY_NAME not set"
# - "Upload failed"
# - "Permission denied"
```

**Check 3: Cloudinary configured?**
```bash
# Check server/.env
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
```
**Fix:** If missing, add these variables from your Cloudinary account

**Check 4: Network tab in dev tools**
1. Press F12
2. Go to Network tab
3. Try uploading image
4. Look for failed requests
5. Click failed request to see error details

---

### Error 5: "Login redirects me to /shop/setup but I didn't register"

**Symptom:** After registration, user is forced to /shop/setup

**Explanation:** This is EXPECTED behavior!

**Expected Flow:**
```
1. User fills registration form
2. Account created with role: "shopowner"
3. Auto-redirect to /shop/setup (must complete setup)
4. User fills 2-step shop setup form
5. Shop registered as pending
6. Redirect to /shop/dashboard
```

**This is correct.** Not a bug.

---

### Error 6: "Products show on dashboard but not in shop preview on Explore"

**Symptom:** Menu shows on `/shop/dashboard` but menu preview is empty on Explore

**Check 1: Timestamp order**
```javascript
// Products must be added AFTER shop creation
db.shops.findOne({ name: "Vadapav Express" }, { createdAt: 1 })
db.products.findOne({ shopId: ObjectId("...") }, { createdAt: 1 })
// shop.createdAt should be BEFORE product.createdAt
```

**Check 2: Shop approval timestamp**
```javascript
// Shop must be approved BEFORE products are added (optional but safer)
db.shops.findOne({ name: "Vadapav Express" })
// After approval, continue adding products
```

---

### Error 7: "Approval button doesn't work"

**Symptom:** "Approve" button is grayed out or doesn't respond

**Check 1: Are you logged in as admin?**
- Top-right corner should show admin icon
- If not, re-login with admin credentials

**Check 2: Is the shop actually pending?**
```javascript
db.shops.findOne({ name: "Vadapav Express" })
// Should have: isActive: false, approvedAt: null
```
**Fix:** If already approved, nothing to approve

**Check 3: Is there a JavaScript error?**
- Press F12 → Console tab
- Look for red error messages
- Take screenshot and check [TESTING_START_HERE.md](./TESTING_START_HERE.md)

**Check 4: Backend API endpoint exists?**
```bash
# These should return data (with auth header)
curl -H "Authorization: Bearer {admin_token}" \
  http://localhost:5000/api/admin/shops/pending
```

---

## 🔧 Database Verification Commands

### Quick Health Check
```javascript
// MongoDB Compass - Run in Console

// 1. Count shops by status
db.shops.countDocuments({ isActive: true })   // Should be 1+
db.shops.countDocuments({ isActive: false })  // Just created

// 2. Check shop details
db.shops.findOne({ name: "Vadapav Express" })

// 3. Check shop's products
db.products.find({ shopId: db.shops.findOne({ name: "Vadapav Express" })._id })

// 4. Check product counts
db.products.countDocuments({ isAvailable: true })   // Should be 3+

// 5. Verify timestamps
db.shops.aggregate([
  { $match: { name: "Vadapav Express" } },
  { $project: { _id: 1, name: 1, createdAt: 1, approvedAt: 1, isActive: 1 } }
])
```

---

## 🌐 API Endpoint Testing

### Test All Shop Endpoints

**1. Fetch all active shops (PUBLIC)**
```bash
curl -X GET http://localhost:5000/api/shops
# Response: Array of shops with isActive: true only
```

**2. View pending shops (ADMIN ONLY)**
```bash
curl -X GET http://localhost:5000/api/admin/shops/pending \
  -H "Authorization: Bearer {admin_token}"
# Response: Array of shops with isActive: false
```

**3. Get shop details (PUBLIC)**
```bash
curl -X GET http://localhost:5000/api/shops/{shopId}
# Response: Single shop object with full details
```

**4. Get shop products (PUBLIC)**
```bash
curl -X GET http://localhost:5000/api/products/shop/{shopId}
# Response: Array of products for that shop
```

**5. Approve shop (ADMIN ONLY)**
```bash
curl -X PUT http://localhost:5000/api/admin/shops/{shopId}/approve \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{ "remarks": "Looks good" }'
# Response: { success: true, message: "Shop approved..." }
```

---

## 📱 Browser Developer Tools Checklist

### When Debugging (Press F12)

**Console Tab:**
- [ ] Look for red error messages
- [ ] Copy full error text
- [ ] Check for network 404 errors
- [ ] Look for CORS errors

**Network Tab:**
- [ ] Filter by "Fetch/XHR"
- [ ] Look for failed requests (red)
- [ ] Click to see response
- [ ] Check status codes (should be 200, 201, not 404, 500)

**Elements Tab:**
- [ ] Search for "Vadapav" (Ctrl+F)
- [ ] Check if DOM has your shop
- [ ] Verify images have src URLs
- [ ] Look for missing elements

**Application Tab:**
- [ ] Check localStorage for auth token
- [ ] Verify token is valid
- [ ] Check cookies for session

---

## 🚨 Critical Status Checks

### Before Testing
- [ ] Backend running: `npm run dev` in `/server`
- [ ] Frontend running: `npm start` in `/client`
- [ ] MongoDB connected and running
- [ ] Cloudinary credentials in `.env`
- [ ] Browser cache cleared (Ctrl+Shift+Delete)

### During Testing
- [ ] No console errors (F12)
- [ ] API calls succeeding (Network tab status 200/201)
- [ ] Database changes visible (MongoDB Compass refresh)
- [ ] Routes loading correctly
- [ ] Images displaying with correct URLs

### After Approval
- [ ] Shop has `isActive: true`
- [ ] Shop has `approvedBy` field set
- [ ] Shop has `approvedAt` timestamp
- [ ] Products exist with matching `shopId`
- [ ] All products have `isAvailable: true`

---

## 📊 Data State Verification Table

| Component | Status | How to Check | Expected Result |
|-----------|--------|--------------|-----------------|
| Shop Created | ✓ | `db.shops.count()` | ≥ 1 |
| Shop Pending | ✓ | `isActive: false` | Before approval |
| Shop Approved | ✓ | `isActive: true` | After admin approve |
| Shop on Explore | ✓ | `GET /api/shops` | Non-empty array |
| Product Created | ✓ | `db.products.count()` | ≥ 3 |
| Product Linked | ✓ | `product.shopId` | Matches `shop._id` |
| Menu on Explore | ✓ | Item count in preview | 3 items max |
| Full Menu on Detail | ✓ | Click "View Shop" | All products |

---

## 🎯 Isolation Testing

### Test Shop Endpoints Only
```bash
# Skip registration, test shop API directly
db.shops.insertOne({
  name: "Test Shop",
  ownerId: ObjectId("..."),
  isActive: true,
  category: "Stall",
  location: { lat: 19.0, lng: 72.0 },
  createdAt: new Date()
})
# Then test GET /api/shops
```

### Test Product Endpoints Only
```bash
# Create shop + products in database
# Test GET /api/products/shop/{shopId}
# Verify response format and data
```

### Test Admin Approval Only
```bash
# Create pending shop in database
# Test PUT /api/admin/shops/{id}/approve as admin
# Verify isActive changed to true
```

---

## 🔑 Key Debugging Principles

### 1. **Check Most Likely Issue First**
| Most Common | Second Common | Less Common |
|------------|---------------|------------|
| Not approved yet | shopId mismatch | JWT token expired |
| API not returning | Frontend not requesting | CORS issue |
| Database not updated | API error not caught | Cloudinary down |

### 2. **Verify Layer by Layer**
```
Database → API → Frontend
     ↓       ↓      ↓
 Check     Check   Check
```

Start with what you can verify (database), then work forward.

### 3. **Use Curl Before JavaScript**
- Curl shows pure API response without frontend complexity
- If curl works but browser doesn't, it's a frontend issue
- If curl fails, it's an API/database issue

### 4. **Document Everything**
```
Issue: [Description]
Steps: [To reproduce]
Database: [State query result]
API: [Endpoint + response]
Frontend: [Console error]
Solution: [What fixed it]
```

---

## 📞 Escalation Path

**If stuck on any issue:**

1. Check [TESTING_START_HERE.md](./TESTING_START_HERE.md)
2. Search this guide for the error
3. Run database verification commands
4. Test API with curl
5. Check browser console (F12)
6. Document issue with:
   - URL where it occurred
   - Exact error message
   - Steps to reproduce
   - Screenshot of console error
   - Database state

---

## ✅ Quick Victory Checklist

**You're doing it right if:**
- [ ] Shop owner registration completes
- [ ] Redirects to /shop/setup (not error)
- [ ] Can submit 2-step shop setup form
- [ ] Images upload without errors
- [ ] Can add menu items from dashboard
- [ ] Menu items display on dashboard
- [ ] Admin can see shop in pending list
- [ ] Admin "Approve" button works
- [ ] Shop appears on /explore after approval
- [ ] No red errors in browser console (F12)
- [ ] Menu preview shows on Explore card
- [ ] Clicking "View Shop" shows full menu

---

**Use this guide alongside [TESTING_START_HERE.md](./TESTING_START_HERE.md) for complete testing support.** 🚀

