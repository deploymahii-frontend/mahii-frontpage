# 🧪 End-to-End Testing Guide - Complete Shop Flow

**Goal:** Verify that a shop owner can register, set up a shop with menu items, get admin approval, and appear on the Explore page.

---

## 📊 Testing Overview

| Phase | User | Action | Expected Result | File Reference |
|-------|------|--------|-----------------|-----------------|
| 1 | Shop Owner | Register account | Account created, redirect to /shop/setup | TESTING_GUIDE.md Part 1 |
| 2 | Shop Owner | Complete shop setup | Shop created with isActive: false | TESTING_GUIDE.md Part 1 |
| 3 | Shop Owner | Upload images | Images stored in Cloudinary | TESTING_GUIDE.md Part 2 |
| 4 | Shop Owner | Add menu items | Products linked to shop via shopId | TESTING_GUIDE.md Part 3 |
| 5 | Admin | View pending shops | "Vadapav Express" in pending list | ADMIN_TESTING.md Workflow 2.2 |
| 6 | Admin | Approve shop | Shop isActive becomes true | ADMIN_TESTING.md Workflow 2.2 |
| 7 | Customer | Visit Explore | Shop appears in correct category | TESTING_GUIDE.md Part 5 |
| 8 | Customer | View menu preview | Top 3 items visible on Explore | TESTING_GUIDE.md Part 5 |
| 9 | Customer | View full menu | All products visible on shop detail | TESTING_GUIDE.md Part 6 |

---

## 🚀 Quick Start - Complete Flow

### Time Estimate: 15-20 minutes

### Prerequisites
- ✅ Server running: `cd server && npm run dev`
- ✅ Client running: `cd client && npm start`
- ✅ Connect browser to: http://localhost:3000
- ✅ Admin account exists: `admin@mahii.dev / NewAdmin@2026!`

---

## Phase 1: Shop Owner Registration & Setup
**Duration: 3-4 minutes**

### Step 1.1: Navigate to Shop Owner Registration
```
URL: http://localhost:3000/register/shopowner
```

### Step 1.2: Fill Registration Form
| Field | Value |
|-------|-------|
| Name | Vadapav Owner |
| Email | `shopowner@test.com` |
| Phone | 9876543210 |
| Password | Test@123 |
| Confirm Password | Test@123 |

**Click:** Register

**Expected Output:**
```
✅ Registration successful!
✅ Redirect: /shop/setup (automatic)
```

### Step 1.3: Complete Shop Setup - Step 1

Form fields:
| Field | Value |
|-------|-------|
| Shop Name | Vadapav Express |
| Category | Stall 🌮 |
| Address | 123 Maharashtra St, Mumbai 400001 |
| Phone | 9876543210 |
| Opening Time | 10:00 AM |
| Closing Time | 10:00 PM |

**Click:** Next

**Expected Output:**
```
✅ Form validation passes
✅ Move to Step 2
```

### Step 1.4: Complete Shop Setup - Step 2

Form fields:
| Field | Value |
|-------|-------|
| Accept Terms | Check ✓ |
| Remarks (optional) | Best Vadapavs in the city |

**Click:** Submit for Approval

**Expected Output:**
```
✅ Shop registered successfully!
✅ Status: Pending Approval
✅ Redirect: /shop/dashboard
```

**Database Check:**
```javascript
db.shops.findOne({ name: "Vadapav Express" })
// Should show: { isActive: false, ownerId: ObjectId, approvedAt: null }
```

---

## Phase 2: Upload Shop Images
**Duration: 2-3 minutes**

### Step 2.1: Navigate to Shop Dashboard
```
URL: http://localhost:3000/shop/dashboard
```

### Step 2.2: Upload Cover Image
1. Look for "Upload Cover Image" section
2. Click upload button
3. Select an image file from your computer (any .jpg/.png)
4. **Wait for upload** to complete

**Expected Output:**
```
✅ Image uploaded to Cloudinary
✅ Cover image displays in preview
✅ Status: "Cover image updated"
```

### Step 2.3: Upload Logo Image
1. Look for "Upload Logo" section
2. Click upload button
3. Select an image file (preferably square/icon-shaped)
4. **Wait for upload** to complete

**Expected Output:**
```
✅ Logo uploaded and resized to 500x500
✅ Logo displays in shop header
✅ Status: "Logo updated"
```

### Step 2.4: Upload Gallery Images (Optional)
1. Look for "Upload Gallery" section
2. Click to select multiple images
3. Select 2-3 images
4. **Wait for upload** to complete

**Expected Output:**
```
✅ Gallery images uploaded
✅ Images appear in gallery slider
```

---

## Phase 3: Add Menu Items
**Duration: 3-4 minutes**

### Step 3.1: Add First Menu Item - Vadapav
1. On shop dashboard, click "Add Menu Item" or "Add Product"
2. Fill form:

| Field | Value |
|-------|-------|
| Product Name | Vadapav |
| Price | 20 |
| Category | Snacks |
| Description | Traditional Marathi snack |
| Veg | Yes ✓ |
| Available | Yes ✓ |

3. **Optional:** Upload product image
4. Click "Save"

**Expected Output:**
```
✅ Product created successfully
✅ "Vadapav" appears in menu list
✅ Price shows: ₹20
```

### Step 3.2: Add Second Menu Item - Pav Bhaji
| Field | Value |
|-------|-------|
| Product Name | Pav Bhaji |
| Price | 35 |
| Category | Main Course |
| Description | Spicy curry with butter pav |
| Veg | Yes ✓ |
| Available | Yes ✓ |

**Click:** Save

### Step 3.3: Add Third Menu Item - Misal Pav
| Field | Value |
|-------|-------|
| Product Name | Misal Pav |
| Price | 25 |
| Category | Snacks |
| Description | Spicy curry with crispy pav |
| Veg | Yes ✓ |
| Available | Yes ✓ |

**Click:** Save

**Expected Output:**
```
✅ Three menu items created
✅ All show in dashboard menu list
✅ Each linked to "Vadapav Express" shop
```

**Database Check:**
```javascript
db.products.find({ shopId: ObjectId("...") })
// Should show 3 products with exact shopId
```

---

## Phase 4: Admin Approval
**Duration: 3-4 minutes**

### Step 4.1: Logout as Shop Owner
1. Click profile icon (top-right)
2. Click "Logout"
3. **Verify:** Redirected to home page

### Step 4.2: Login as Admin
1. Navigate to `/login/admin`
2. Or click "Admin Login" link

Form:
| Field | Value |
|-------|-------|
| Email | `admin@mahii.dev` |
| Password | `NewAdmin@2026!` |

**Click:** Login

**Expected Output:**
```
✅ Login successful
✅ Redirect: /admin/dashboard
✅ See admin toolbar/menu
```

### Step 4.3: Navigate to Shop Approvals
1. On admin dashboard, look for:
   - "Shop Management" section
   - "Pending Approvals" tab
   - Or look in navigation menu for "Shops"

2. Find "Vadapav Express" in the pending list

**Expected Output:**
```
✅ "Vadapav Express" visible in pending list
✅ Status shows: "Pending"
✅ Owner: Vadapav Owner (or shopowner@test.com)
```

### Step 4.4: Approve the Shop
1. Click "Approve" button next to "Vadapav Express"
2. Optional: Add approval remarks
3. Click "Confirm Approve"

**Expected Output:**
```
✅ Success message: "Shop approved successfully!"
✅ Shop status: "Approved" or "Active"
✅ Disappears from pending list
```

**Database Check:**
```javascript
db.shops.findOne({ name: "Vadapav Express" })
// Should show: { isActive: true, approvedAt: ISODate(...), approvedBy: ObjectId(...) }
```

---

## Phase 5: Verify on Explore Page
**Duration: 2-3 minutes**

### Step 5.1: Logout as Admin
1. Click profile (top-right)
2. Click "Logout"

### Step 5.2: Navigate to Explore Page
```
URL: http://localhost:3000/explore
```

### Step 5.3: Verify Shop Appears
1. Scroll down to find categories
2. Look for 🌮 **Stall** section

**Expected Output:**
```
✅ 🌮 Stall section is visible
✅ "Vadapav Express" card appears in the section
✅ Shows: Shop name, cover image, location badge
```

### Step 5.4: Verify Menu Preview
On the "Vadapav Express" card, check:

| Element | Expected |
|---------|----------|
| **Menu Preview Title** | "Menu Preview" |
| **Item 1** | 🥘 Vadapav - ₹20 |
| **Item 2** | 🍲 Pav Bhaji - ₹35 |
| **Item 3** | 🍲 Misal Pav - ₹25 |
| **View Button** | "View Shop" button visible |

**Expected Output:**
```
✅ Top 3 menu items display
✅ Price format: ₹20, ₹35, ₹25
✅ Category emoji shows
```

### Step 5.5: Open Shop Detail
1. Click "View Shop" on the shop card
2. Or click the shop card itself

**Expected Output:**
```
✅ Navigate to shop detail page (/shop/:shopId)
✅ Full shop profile displays
```

### Step 5.6: Verify Full Menu on Detail Page
1. Scroll to Menu section
2. Verify all 3 items display:

**Expected Output:**
```
✅ "Vadapav" - ₹20 - Snacks - 🥘
✅ "Pav Bhaji" - ₹35 - Main Course - 🍲
✅ "Misal Pav" - ₹25 - Snacks - 🍲
✅ Each item available for interaction
```

---

## Phase 6: Advanced Verification (Optional)
**Duration: 5-10 minutes**

### 6.1: Test Search Functionality
1. Go to Explore page
2. Search for "Vadapav"

**Expected:**
```
✅ "Vadapav Express" appears in search results
✅ Click result to open shop
```

### 6.2: Test Category Filter
1. On Explore page, find category filters
2. Uncheck all categories except "Stall"
3. Click "Apply" or watch list update

**Expected:**
```
✅ Only Stall category shops display
✅ "Vadapav Express" clearly visible
```

### 6.3: Test Sort Options
1. Look for sort dropdown
2. Try: "Newest First", "Top Rated", "Nearest"

**Expected:**
```
✅ "Vadapav Express" position may change based on sort
✅ List reorders without errors
```

### 6.4: Test Menu Item Count
1. Back on Explore, count visible items in preview
2. Then click "View Shop" and count in full menu

**Expected:**
```
✅ Explore shows max 3 items (or less if fewer exist)
✅ Shop detail shows ALL items (3 items: Vadapav, Pav Bhaji, Misal Pav)
```

---

## 🔍 Troubleshooting Quick Reference

| Problem | Quick Fix | Details |
|---------|-----------|---------|
| **Shop doesn't appear on Explore** | Check admin approval | See: ADMIN_TESTING.md Workflow 2.2 |
| **Menu items don't show preview** | Verify product shopId matches | Database check: db.products.find() |
| **Images not uploading** | Check Cloudinary connection | Server logs should show error |
| **Can't find Approve button** | Check if shop is actually pending | See: ADMIN_TESTING.md Step 4.3 |
| **Login fails** | Clear browser cache | Ctrl+Shift+Delete → Clear all |
| **Getting 404 on /shop/setup** | Route not registered | Check: client/src/App.js has the route |
| **Menu items show but no images** | Image upload failed silently | Check server terminal for errors |

---

## ✅ Success Criteria Checklist

Mark each as you complete:

### Phase 1: Registration & Setup
- [ ] Shop owner registration successful
- [ ] Redirected to /shop/setup
- [ ] Shop setup wizard displays both steps
- [ ] Shop created with isActive: false

### Phase 2: Images
- [ ] Cover image uploads successfully
- [ ] Logo image uploads and displays
- [ ] Gallery images upload (optional)

### Phase 3: Menu
- [ ] Vadapav product created (₹20)
- [ ] Pav Bhaji product created (₹35)
- [ ] Misal Pav product created (₹25)
- [ ] All products show in shop dashboard

### Phase 4: Admin Approval
- [ ] Admin login successful
- [ ] "Vadapav Express" in pending list
- [ ] Approval button works
- [ ] Shop status changes to Active
- [ ] isActive: true in database

### Phase 5: Explore Page
- [ ] Shop appears in 🌮 Stall section
- [ ] Cover image displays
- [ ] Menu preview shows 3 items
- [ ] "View Shop" button exists and works

### Phase 6: Shop Detail
- [ ] All shop information displays
- [ ] Full menu (3 items) visible
- [ ] Layout looks good
- [ ] No console errors (F12 → Console)

### Phase 7: Search & Filter (Optional)
- [ ] Search functionality works
- [ ] Category filter works
- [ ] Sort options work
- [ ] No console errors

---

## 📝 Error Logging

If you encounter any errors, note:

1. **URL** where error occurred
2. **Error message** from browser (F12 → Console)
3. **Server error** from terminal output
4. **Database state** (use MongoDB Compass)
5. **Steps to reproduce**

**Template:**
```
ERROR: [Error message]
URL: [Where it happened]
Steps: 
  1. [Step 1]
  2. [Step 2]
Console Error: [Full error text]
Server Log: [Backend error output]
Database: [Relevant collection state]
```

---

## 🎯 Next After Testing

✅ **If all tests pass:**
- Repeat with different shop types (Cafe, Hotel, Mess)
- Test with multiple shops
- Run performance tests with 10+ shops
- Test with multiple admins
- Test concurrent registrations

❌ **If tests fail:**
- Document the exact failure (use template above)
- Check troubleshooting section
- Review backend server logs
- Clear browser cache and retry
- Check MongoDB connection

---

## 📚 Related Documentation

- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Detailed shop registration flow
- [ADMIN_TESTING.md](./ADMIN_TESTING.md) - Admin approval workflow
- [QUICK_TEST_REFERENCE.md](./QUICK_TEST_REFERENCE.md) - Quick lookup table

## 🎉 Completion Time

**Typical completion: 20-25 minutes**

Phase 1 (Reg): 3-4 min  
Phase 2 (Images): 2-3 min  
Phase 3 (Menu): 3-4 min  
Phase 4 (Admin): 3-4 min  
Phase 5 (Explore): 2-3 min  
Phase 6 (Advanced): 5-10 min (optional)  

**Total: ~20-25 minutes for complete end-to-end validation**

---

**Happy Testing! Let us know if you encounter any issues.** 🚀
