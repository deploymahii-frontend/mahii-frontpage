# 🧪 Mahii Shop Testing Guide

## Complete Step-by-Step Testing Procedure

### **PART 1: SHOP OWNER REGISTRATION & SETUP**

#### Step 1.1: Register as Shop Owner
1. Go to `http://localhost:3000/register/shopowner`
2. Fill in **Step 1 - Owner Information:**
   - **Owner Name:** Rahul Sharma
   - **Email:** shopowner@test.com
   - **Phone:** 9876543210
   - **Shop Name:** Vadapav Express
   - **Category:** Stall (Food Stall / Kiosk)
   - **Shop Address:** Plot 45, Main Street, Pune
   - **Area:** Koregaon Park
   - **City:** Pune

3. Click "Next Step"

4. Fill in **Step 2 - Verification:**
   - **FSSAI License:** FSSAI12345678
   - **Bank Account Number:** 1234567890123456
   - **IFSC Code:** HDFC0001234
   - **Password:** Test@123
   - **Confirm Password:** Test@123

5. Click "Register" → You'll be redirected to Shop Setup page

#### Step 1.2: Setup Shop Details
1. You should now be on `/shop/setup`
2. Fill in **Step 1 - Shop Details:**
   - **Shop Name:** Vadapav Express
   - **Category:** 🌮 Stall / Kiosk
   - **Description:** Authentic Mumbai-style vadapav, freshly made daily
   - **Address:** Plot 45, Main Street, Pune
   - **Area:** Koregaon Park
   - **City:** Pune
   - **Phone:** 9876543210
   - **Opening Time:** 09:00
   - **Closing Time:** 22:00

3. Click "Next Step"

4. In **Step 2 - Visibility:**
   - Review shop preview
   - Click "Create Shop" to submit

✅ **Shop Created Successfully!** You'll be redirected to `/shop/dashboard`

---

### **PART 2: ADD SHOP IMAGE**

#### Step 2.1: Upload Cover Image
1. Login to shop dashboard: `/shop/dashboard`
2. Click the **"Media"** tab
3. Under "Shop Cover Image" section:
   - Click "Upload Cover Image" button
   - Select an image file (JPG/PNG recommended, min 800x600px)
   - **Recommended image:** Download any restaurant/food stall image
   - Wait for upload to complete (shows checkmark)

#### Step 2.2: Upload Shop Logo (Optional)
- Click "Upload Logo"
- Select a square image (500x500px)

#### Step 2.3: Upload Gallery Images
- Click "Upload Gallery"
- Select multiple images of your shop
- Images will be resized to 800x600px automatically

✅ **Images Added!** Refresh dashboard to verify

---

### **PART 3: ADD MENU ITEM (VADAPAV)**

#### Step 3.1: Access Menu Manager
1. In Shop Dashboard, click the **"Menu"** tab
2. Click **"+ Add New Item"** button

#### Step 3.2: Fill Product Details
```
Product Name:          Vadapav (Marathi Special)
Category:              Snacks
Price:                 ₹20
Description:           Crispy fried gram flour snack with spiced potato filling. 
                       Best served with green chutney. 
                       Weight: 150g per piece
Vegetarian:            ✓ (Already selected)
Availability:          ✓ Available
Popular Item:          ✓ (Check this to show on Explore foreground)
Preparation Time:      5 minutes
```

#### Step 3.3: Submit Product
- Click "Save Product"
- Toast notification: "Product added"
- Vadapav should appear in the menu list below

#### Step 3.4: Add More Menu Items (Optional)
- Add "Pav Bhaji" - ₹35
- Add "Sev Puri" - ₹15
- Add "Chai" - ₹10

✅ **Menu Items Added!**

---

### **PART 4: VERIFY ON DASHBOARD**

#### Step 4.1: Check Dashboard Overview
1. Go back to **"Overview"** tab on Shop Dashboard
2. Verify:
   - ✅ Shop cover image displays
   - ✅ Shop status shows
   - ✅ Details are correct

#### Step 4.2: Check Menu Manager
1. Click **"Menu"** tab
2. You should see:
   ```
   ✅ Vadapav (Marathi Special) - ₹20 - Snacks
   ✅ Pav Bhaji - ₹35 - Snacks
   ...
   ```

---

### **PART 5: VERIFY ON EXPLORE PAGE**

#### Step 5.1: Check Admin Approval (If Required)
**⚠️ NOTE:** If shop is not showing on Explore, it might need admin approval:
1. Go to `/admin/dashboard`
2. Admin login: Use admin credentials
3. Click "Pending Approvals" or "Shop Approvals"
4. Find "Vadapav Express"
5. Click ✅ "Approve" button

#### Step 5.2: Verify on Explore Page
1. **Logout** from shop account
2. Go to `/explore`
3. You should see:
   - 🌮 **Stalls** section (if category filter shows)
   - **"Vadapav Express"** shop card

#### Step 5.3: Check Shop Card
On the Explore page, the shop card should display:
```
┌─────────────────────────────────────┐
│  [Shop Cover Image]                │
│  🌮 Stall          ✅ Open          │
│  ⭐ 4.5                             │
├─────────────────────────────────────┤
│ Vadapav Express                      │
│ Authentic Mumbai-style vadapav...    │
│ 📍 Koregaon Park • 2.5 km away       │
│ ₹20-35 for two                       │
│                                      │
│ 🍴 Popular Items:                    │
│ • Vadapav (Marathi Special)         │
│ • Pav Bhaji                         │
│ • Sev Puri                          │
│ • +1 more                           │
│                                      │
│ ➜ View Shop                         │
└─────────────────────────────────────┘
```

#### Step 5.4: Click "View Shop"
1. Click the shop card or "View Shop" link
2. You should go to `/shop/stall/[shopId]`
3. Verify:
   - ✅ Full shop details displayed
   - ✅ Cover image shown
   - ✅ Menu items listed (Vadapav, etc.)
   - ✅ Category shows as "🌮 Stall"
   - ✅ Location shows "Koregaon Park"

---

### **PART 6: TEST FILTERS & SORTING**

#### Step 6.1: Filter by Category
1. On Explore page, click **"🌮 Stall"** category chip
2. Vadapav Express should appear in filtered results
3. Click **"All Categories"** to reset

#### Step 6.2: Sort by Different Options
1. Click **Sort By** dropdown
2. Try:
   - "Rating: High to Low"
   - "Distance: Near to Far"
   - "Cost: Low to High"
3. Shop list should reorganize

---

### **✅ VERIFICATION CHECKLIST**

- [ ] Shop Owner registered successfully
- [ ] Redirected to `/shop/setup` after registration
- [ ] Shop setup completed
- [ ] Shop cover image uploaded
- [ ] Vadapav menu item added with price ₹20
- [ ] Additional menu items added (optional)
- [ ] Dashboard shows shop details correctly
- [ ] Menu tab displays all items
- [ ] Shop appears on Explore page (after admin approval)
- [ ] Shop card shows cover image
- [ ] Popular items display in preview
- [ ] Click "View Shop" works correctly
- [ ] Full shop page loads with all menu items
- [ ] Category filter works
- [ ] Sort options work

---

## 📝 TEST CREDENTIALS

### Shop Owner Account:
```
Email:    shopowner@test.com
Password: Test@123
```

### Admin Account (for approval):
```
Email:    admin@test.com
Password: Admin@123
```

---

## 🐛 COMMON ISSUES & FIXES

### Issue: Shop not showing on Explore
**Solution:** 
- Check if shop is approved by admin
- Ensure `isActive` status is true
- Clear browser cache and refresh

### Issue: Menu item not showing
**Solution:**
- Ensure product `isAvailable` is true
- Check that shopId is correctly linked
- Refresh dashboard

### Issue: Image not uploading
**Solution:**
- Use JPG/PNG format
- Ensure file size < 5MB
- Check browser console for errors

---

## 📊 EXPECTED API CALLS

The system should make these API calls:

1. **Register Shop Owner**
   ```
   POST /api/auth/shopowner/register
   ```

2. **Create Shop**
   ```
   POST /api/shops
   ```

3. **Upload Images**
   ```
   POST /api/shops/media/cover
   POST /api/shops/media/logo
   POST /api/shops/media/gallery
   ```

4. **Add Menu Item**
   ```
   POST /api/products
   ```

5. **Get Nearby Shops**
   ```
   GET /api/shops/nearby?lat=18.5204&lng=73.8567&isVisible=true
   ```

6. **Get Shop Products**
   ```
   GET /api/products/shop/[shopId]
   ```

---

## 🎯 FINAL RESULT

After completing all steps, you should see:

✅ **Dashboard:** 
- Shop image visible
- Menu items listed
- Shop details correct

✅ **Explore Page:**
- Shop card with image
- Popular items preview
- "Vadapav Express" in stalls section
- Clickable to view full shop details

✅ **Shop Details Page:**
- Full menu with Vadapav
- All items showing correctly
- Category badge shows 🌮
