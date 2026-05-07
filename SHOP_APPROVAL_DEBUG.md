# Shop Approval Debug Checklist

**Issue:** Shop approvals not showing on admin dashboard

---

## ✅ Changes Made

I've added debugging to help identify the issue:

1. **Enhanced logging in `AdminDashboard.jsx`**:
   - Logs `pendingShopsDetails` when API returns it
   - Logs `pendingShops` state updates
   - Logs when approval buttons are clicked
   - Shows exact error message from API

2. **Fixed pending shops count stat**:
   - Changed from `data.stats?.users?.pendingApproval` 
   - To: `data.stats?.shops?.pending` (correct field)

3. **Added error details to toast messages**:
   - Shows API error message if approval fails

---

## 🔍 How to Debug

### Step 1: Open Browser Developer Tools (F12)

1. Open Admin Dashboard at: `http://localhost:3000/admin/dashboard`
2. Press `F12` to open Developer Tools
3. Go to **Console** tab

### Step 2: Check Logs When Page Loads

Look for messages like:
```
Dashboard data received: {...}
Pending shops: [{...}, {...}]
State updated with pending shops count: 2
```

**If you see these:** The API is working and data is loading ✅

**If you DON'T see these:** API call failed - check Network tab

---

### Step 3: Check Network Tab (F12 → Network)

1. In Developer Tools, click **Network** tab
2. Reload the page (Ctrl+R)
3. Look for request: `GET /api/admin/dashboard`
4. Click on it and check:

**Check Response:**
```json
{
  "success": true,
  "stats": {
    "shops": {
      "pending": 2        // Should show number of pending shops
    }
  },
  "pendingShopsDetails": [
    {
      "_id": "...",
      "name": "Vadapav Express",
      "isActive": false
    }
  ]
}
```

**If it shows 0 pending shops:**
- No shops created yet, OR
- All shops already approved

**If response is 401/403:**
- Not logged in as admin
- Admin token expired

**If response is 500:**
- Backend error - check server terminal

---

### Step 4: Verify Data in "Pending Approvals" (Overview Tab)

1. On Admin Dashboard, you should see a section: **"Pending Shop Approvals"**
2. If it shows: `"No pending approvals"` → No shops are in pending state

**Check the "Shop Approvals" tab:**
1. Click **"Shop Approvals"** tab (shows: "Shop Approvals (X)")
2. You should see a list of pending shops

---

## 🐛 Troubleshooting Guide

### Issue 1: No Pending Shops Showing

**Check 1: Did you create shops?**
```bash
# In MongoDB Compass, find your shops:
db.shops.find()
# Should show at least one shop with: { isActive: false }
```

**Check 2: Is the API returning them?**
```
Go to Network tab → Look for /api/admin/dashboard
Response should have: "pendingShopsDetails": [...]
Should not be empty array
```

**Check 3: Check Console Logs**
```
Pending shops: [{_id: "...", name: "..."}]
# If this shows empty array: []
# Then backend is not finding pending shops
```

**Fix:** 
- Check MongoDB - are shops with `isActive: false` present?
- If not, register a new shop and test

---

### Issue 2: API Returns 401/403 Unauthorized

**Cause:** Not logged in as admin or token expired

**Fix:**
1. Logout (click profile → Logout)
2. Login again as admin with:
   - Email: `admin@mahii.dev`
   - Password: `NewAdmin@2026!`
3. Reload dashboard
4. Check Network tab - should see `Authorization: Bearer {token}` header

---

### Issue 3: API Call Fails (500 Error)

**Location:** Check server terminal output

**Common causes:**
- MongoDB connection issue
- Missing model fields
- Incorrect query

**Check server logs:**
```
Look for error messages in the terminal where npm start runs
```

---

### Issue 4: Approval Button Doesn't Work

**Check Console:**
Look for error message after clicking Approve:
```
Approval error: {response: {data: {message: "..."}}}
```

**Common causes:**

**A) Wrong shop ID format**
```
Check: Shop ID should be valid MongoDB ObjectId
```

**B) Shop already approved**
```
Database may already have isActive: true
```

**C) Backend endpoint not responding**
```
Check Network tab - should see PUT /api/admin/shops/{id}/approve
Check response status - should be 200
```

---

## 📝 Step-by-Step Test Guide

### Test 1: Verify Pending Shop Exists

```javascript
// In MongoDB Compass Console:
db.shops.findOne({ isActive: false })
```

**Expected output:**
```json
{
  "_id": ObjectId("..."),
  "name": "Test Shop",
  "isActive": false,
  "createdAt": ISODate("2026-04-14T..."),
  "approvedAt": null
}
```

If nothing shows: **No pending shops exist** - create one first

---

### Test 2: Verify Admin Dashboard API Works

**Using curl in terminal:**
```bash
# First get admin token (login)
# Then:
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer {your_admin_token}"
```

**Expected response:**
- Status: 200
- Body should include: `"pendingShopsDetails": [{...}]`

---

### Test 3: Test Approval Endpoint

**Using curl:**
```bash
curl -X PUT http://localhost:5000/api/admin/shops/{shopId}/approve \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{"isActive": true}'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Shop approved successfully",
  "shop": {
    "_id": "...",
    "isActive": true,
    "approvedAt": "2026-04-14T..."
  }
}
```

---

## 🔧 Quick Fixes to Try

### Fix 1: Clear Browser Cache & Reload

```
Ctrl+Shift+Delete (on Windows)
Select "All time"
Clear browsing data
Close browser
Reopen and test
```

### Fix 2: Re-login as Admin

```
1. Logout completely
2. Clear browser cache
3. Login again with admin credentials
4. Reload admin dashboard
```

### Fix 3: Restart Backend Server

```
1. Stop backend (Ctrl+C in terminal)
2. Check MongoDB is running
3. Restart: npm start or node server.js
4. Test again
```

### Fix 4: Check if Shops Were Created

```javascript
// MongoDB:
db.shops.countDocuments({ isActive: false })  // Should be > 0
db.shops.countDocuments({ isActive: true })   // Count of approved
```

---

## 📋 Data Requirements

For pending shops to appear:

✅ **Shop must exist:**
```
✓ Created via /shop/setup endpoint
✓ Has name, category, location
✓ Has ownerId (links to user)
✓ Has isActive: false
```

✅ **Admin must be logged in:**
```
✓ User role is "admin"
✓ JWT token is valid
✓ Auth header sent in request
```

✅ **API must return data:**
```
✓ /api/admin/dashboard returns 200
✓ Response includes pendingShopsDetails
✓ Array is not empty
```

✅ **Frontend must display it:**
```
✓ State.pendingShops populated
✓ Conditional rendering checks length > 0
✓ React re-renders with data
```

---

## 🎯 Expected Behavior

### Before Approval:
- **Console:** Shows pending shops array with items
- **UI Tab:** "Shop Approvals (X)" shows count
- **Shop Approval Tab:** List displays pending shop cards
- **Buttons:** Green "Approve" button is clickable

### After Approval:
- **Database:** Shop has `isActive: true`
- **Explore Page:** Shop appears in category section
- **Console:** Success message appears
- **Pending List:** Shop disappears from pending list

---

## 📞 Debug Script

**Save this in browser console and run:**

```javascript
// Check pending shops in state
console.log('Checking admin dashboard state...');

// Fetch dashboard data
fetch('/api/admin/dashboard')
  .then(r => {
    console.log('Status:', r.status);
    return r.json();
  })
  .then(data => {
    console.log('API Response:', data);
    console.log('Pending shops count:', data.pendingShopsDetails?.length || 0);
    console.log('Pending shops data:', data.pendingShopsDetails);
    console.log('Stats - pending:', data.stats?.shops?.pending);
    
    // Check each shop
    (data.pendingShopsDetails || []).forEach((shop, i) => {
      console.log(`Shop ${i+1}:`, {
        name: shop.name,
        id: shop._id,
        isActive: shop.isActive,
        owner: shop.ownerId?.name
      });
    });
  })
  .catch(err => {
    console.error('Error fetching:', err);
  });
```

**Run it and note the output**

---

## ✅ Verification Checklist

After making these changes, verify:

- [ ] Build succeeds: `npm run build` (no errors)
- [ ] Console shows logs when dashboard loads
- [ ] Network tab shows `/api/admin/dashboard` request (status 200)
- [ ] Response includes `pendingShopsDetails` array
- [ ] If shops exist with `isActive: false`, they appear in the list
- [ ] Approve button is clickable
- [ ] After clicking Approve, console shows success logs
- [ ] Shop disappears from pending list
- [ ] Shop appears on Explore page

---

## Next Action

1. **Open browser console (F12)**
2. **Go to admin dashboard**
3. **Look for the logs:**
   - `Dashboard data received:`
   - `Pending shops:`
   - `State updated with pending shops count:`
4. **Report what you see** - this will help identify the exact issue
5. **Check Network tab** for `/api/admin/dashboard` response

**Once you have the logs, you'll know exactly where the problem is!**
