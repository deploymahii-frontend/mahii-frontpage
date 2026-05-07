# 🎯 Complete Testing Suite - Start Here

This document summarizes all available testing guides and helps you choose the right one for your needs.

---

## 📚 Available Testing Guides

### 1. **[END_TO_END_TESTING.md](./END_TO_END_TESTING.md)** ⭐ START HERE
**For:** Complete shop registration → approval → display flow validation  
**Time:** 20-25 minutes  
**Contains:**
- Step-by-step walkthrough from shop owner registration to Explore page
- Phase breakdowns (Registration, Images, Menu, Admin Approval, Explore)
- Verification checklist
- Troubleshooting guide

**When to use:** First time testing the entire feature  
**Best for:** New testers or QA validation

---

### 2. **[TESTING_GUIDE.md](./TESTING_GUIDE.md)**
**For:** Detailed shop registration and menu item flow  
**Time:** 10-15 minutes  
**Contains:**
- Part 1: Shop owner registration & setup
- Part 2: Shop image uploads
- Part 3: Menu item addition
- Part 4: Dashboard verification
- Part 5: Explore page verification
- Part 6: Filter & sort testing
- Verification checklist (13 items)
- Troubleshooting section

**When to use:** Focused testing on shop setup and menu features  
**Best for:** Feature-specific validation

---

### 3. **[ADMIN_TESTING.md](./ADMIN_TESTING.md)**
**For:** Admin account creation and shop approval workflow  
**Time:** 5-10 minutes  
**Contains:**
- Admin credentials (for testing)
- Admin account setup instructions
- Admin login procedures
- **Workflow 2: Shop Approval** (NEW - just added!)
  - Registration & setup phase
  - Admin approval process
  - Verification after approval
- API endpoint reference

**When to use:** Admin-specific testing or approval workflow verification  
**Best for:** Admin approval testing and troubleshooting

---

### 4. **[QUICK_TEST_REFERENCE.md](./QUICK_TEST_REFERENCE.md)**
**For:** Quick lookup table with test data and flow diagram  
**Time:** 2-3 minutes lookup  
**Contains:**
- Quick reference data table
- Testing flow diagram
- Credentials lookup
- Common commands

**When to use:** During testing as a reference card  
**Best for:** Fast lookup during active testing

---

## 🚀 Quick Start (15 minutes)

### Prerequisites
```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend  
cd client
npm start

# Browser: Open
http://localhost:3000
```

### Testing Sequence

**Step 1: Register Shop Owner (3 min)**
- NavigateTo `/register/shopowner`
- Email: `shopowner@test.com`
- Password: `Test@123`
- Goes to `/shop/setup`
- Follow [TESTING_GUIDE.md Part 1](./TESTING_GUIDE.md#part-1-shop-owner-registration)

**Step 2: Upload Images (3 min)**
- Upload cover image
- Upload logo image
- Follow [TESTING_GUIDE.md Part 2](./TESTING_GUIDE.md#part-2-shop-image-upload)

**Step 3: Add Menu Items (3 min)**
- Add Vadapav (₹20)
- Add Pav Bhaji (₹35)
- Follow [TESTING_GUIDE.md Part 3](./TESTING_GUIDE.md#part-3-add-menu-items)

**Step 4: Admin Approval (3 min)**
- Login as `admin@mahii.dev`
- Approve "Vadapav Express"
- Follow [ADMIN_TESTING.md Workflow 2](./ADMIN_TESTING.md#workflow-2-approve-a-new-shop-registration-shopsetup-flow)

**Step 5: Verify on Explore (3 min)**
- Navigate to `/explore`
- Verify shop in 🌮 Stall section
- Verify menu preview shows 3 items
- Follow [TESTING_GUIDE.md Part 5](./TESTING_GUIDE.md#part-5-explore-page-verification)

---

## 📋 Testing Scenarios

### Scenario A: First Time Complete Flow
**Duration:** 20-25 minutes  
**Guide:** [END_TO_END_TESTING.md](./END_TO_END_TESTING.md)

### Scenario B: Quick Feature Check
**Duration:** 10-15 minutes  
**Guide:** [TESTING_GUIDE.md](./TESTING_GUIDE.md)

### Scenario C: Admin Approval Only
**Duration:** 5-10 minutes  
**Guide:** [ADMIN_TESTING.md - Workflow 2](./ADMIN_TESTING.md)

### Scenario D: Shop Visibility Issue
**Duration:** 2-5 minutes  
**Guide:** [END_TO_END_TESTING.md - Phase 6](./END_TO_END_TESTING.md#phase-6-advanced-verification-optional) + Troubleshooting

### Scenario E: Multiple Shops
**Duration:** 30-40 minutes  
**Process:** Repeat Scenario A with different shop names/categories

---

## 🔧 Test Data Reference

### Shop Owner
```
Email:     shopowner@test.com
Password:  Test@123
Shop Name: Vadapav Express
Category:  Stall 🌮
```

### Admin Account
```
Email:    admin@mahii.dev
Password: NewAdmin@2026!
Note:     Change immediately in production!
```

### Menu Items
```
Item 1: Vadapav       | ₹20 | Snacks    | Veg ✓
Item 2: Pav Bhaji     | ₹35 | Main Crs  | Veg ✓
Item 3: Misal Pav     | ₹25 | Snacks    | Veg ✓
```

---

## ✅ Verification Checklist

### Core Features
- [ ] Shop owner can register
- [ ] Shop setup redirects from registration
- [ ] Shop images upload successfully
- [ ] Menu items can be added
- [ ] Admin can approve shops
- [ ] Shop appears on Explore after approval
- [ ] Menu preview shows on Explore
- [ ] Full menu displays on shop detail page

### Admin Workflow
- [ ] Admin can login
- [ ] Admin can view pending shops
- [ ] Admin can click approve
- [ ] Shop status changes to Active
- [ ] isActive flag set to true

### User Experience
- [ ] Search works on Explore
- [ ] Category filter works
- [ ] Sort options work
- [ ] No console errors
- [ ] Responsive design works

---

## 🐛 Troubleshooting Matrix

| Issue | Check | Solution |
|-------|-------|----------|
| Shop doesn't appear on Explore | Admin approval status | [View docs](#phase-4-admin-approval) |
| Menu items missing | Product shopId reference | [Database check](./END_TO_END_TESTING.md#phase-3-add-menu-items) |
| Images not uploading | Cloudinary connection | Check server logs |
| Can't find approve button | Admin dashboard location | [Admin guide](./ADMIN_TESTING.md#step-42--navigate-to-shop-management) |
| Login issues | Browser cache | Clear cache & retry |
| API 404 errors | Route registration | Check [App.js](../client/src/App.js) |

---

## 📊 Testing Workflow Diagram

```
START
  ↓
[Shop Owner Registration]
  ↓
[Shop Setup (2-step form)]
  ↓
[Upload Images]
  ↓
[Add Menu Items]
  ↓
[LOGOUT - Switch to Admin]
  ↓
[Admin Login]
  ↓
[Approve Shop]
  ↓
[LOGOUT - Switch to Customer]
  ↓
[Visit Explore Page]
  ↓
[Verify Shop Appears]
  ↓
[Verify Menu Preview]
  ↓
[Click "View Shop"]
  ↓
[Verify Full Menu]
  ↓
SUCCESS ✅
```

---

## 📞 Quick Command Reference

### Start Services
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm start

# Open Browser
http://localhost:3000
```

### Database Checks (MongoDB Compass)
```javascript
// Find specific shop
db.shops.findOne({ name: "Vadapav Express" })

// Find shop products
db.products.find({ shopId: ObjectId("...") })

// Count pending shops
db.shops.countDocuments({ isActive: false })

// List all active shops
db.shops.find({ isActive: true })
```

### API Tests (Postman/curl)
```bash
# Get all shops (only shows active: isActive: true)
curl http://localhost:5000/api/shops

# Get pending shops (admin only)
curl -H "Authorization: Bearer {token}" \
  http://localhost:5000/api/admin/shops/pending

# Get shop products
curl http://localhost:5000/api/products/shop/{shopId}
```

---

## 🎯 Expected Outcomes

### After Registration
```
✅ Shop created: isActive: false
✅ Redirect: /shop/setup complete
✅ Shop visible: Admin pending list
✅ Not visible: Explore page (until approved)
```

### After Approval
```
✅ Shop: isActive: true
✅ Shop visible: Explore page
✅ Menu preview: Shows top 3 items
✅ Detail page: Shows all products
```

### After Menu Add
```
✅ Products: Created and saved
✅ shopId: Matches exactly
✅ Menu preview: Updates on Explore
✅ Detail: Shows complete list
```

---

## 🚨 Common Issues & Solutions

### Issue: "Shop doesn't show on Explore after days"
**Solution:** Check if admin approved. Go to [ADMIN_TESTING.md - Workflow 2.2](./ADMIN_TESTING.md)

### Issue: "Menu items appear on dashboard but not on Explore"
**Solution:** 
1. Verify shop is approved (isActive: true)
2. Check products have correct shopId
3. Verify products have isAvailable: true

### Issue: "Getting 404 when accessing routes"
**Solution:**
1. Check routes are imported in [client/src/App.js](../client/src/App.js)
2. Ensure `<ProtectedRoute>` component is used for protected pages
3. Verify role-based access is correct

### Issue: "Blank page or infinite loading on Explore"
**Solution:**
1. Press F12 to open developer console
2. Check for JavaScript errors
3. Check network tab for failed API calls
4. Clear browser cache: Ctrl+Shift+Delete

### Issue: "Images showing broken image icon"
**Solution:**
1. Verify Cloudinary upload was successful
2. Check image URLs in database
3. Check browser console for 404 errors
4. Verify image URL is callable from browser

---

## 📈 Next Steps After Testing

### If All Tests Pass ✅
1. Test with multiple shops (different categories)
2. Test concurrent user flows
3. Test edge cases (very long names, special characters)
4. Performance testing with 50+ shops
5. Mobile responsiveness testing

### If Tests Fail ❌
1. Document the exact step where failure occurs
2. Screenshot the error message
3. Note the error from browser console (F12)
4. Check server terminal output for backend errors
5. Post issue with all details in project documentation

---

## 📞 Support Resources

**Each guide includes:**
- Step-by-step instructions
- Expected outputs at each step
- Database verification queries
- API endpoint reference
- Troubleshooting section
- Common issues & solutions

**Documentation Files:**
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Main testing guide
- [ADMIN_TESTING.md](./ADMIN_TESTING.md) - Admin workflows
- [END_TO_END_TESTING.md](./END_TO_END_TESTING.md) - Complete flow breakdown
- [QUICK_TEST_REFERENCE.md](./QUICK_TEST_REFERENCE.md) - Quick lookup

---

## 🎉 Success Metrics

**Your testing is successful when:**

1. ✅ Shop owner can register at `/register/shopowner`
2. ✅ Shop setup wizard completes (2 steps)
3. ✅ Images upload without errors
4. ✅ Menu items save and display  
5. ✅ Admin can approve pending shops
6. ✅ Approved shop appears on Explore
7. ✅ Category grouping works (🌮 Stall section)
8. ✅ Menu preview shows 3 items on Explore
9. ✅ Clicking "View Shop" opens detail with full menu
10. ✅ Search and filter work correctly
11. ✅ No console errors during entire flow
12. ✅ Database reflects all changes

---

## ⏱️ Estimated Timelines

| Task | Time | Guide |
|------|------|-------|
| Shop Registration | 3-4 min | [TESTING_GUIDE.md Part 1](./TESTING_GUIDE.md#part-1-shop-owner-registration) |
| Image Upload | 2-3 min | [TESTING_GUIDE.md Part 2](./TESTING_GUIDE.md#part-2-shop-image-upload) |
| Menu Items | 3-4 min | [TESTING_GUIDE.md Part 3](./TESTING_GUIDE.md#part-3-add-menu-items) |
| Admin Approval | 3-4 min | [ADMIN_TESTING.md Workflow 2](./ADMIN_TESTING.md) |
| Explore Verification | 2-3 min | [TESTING_GUIDE.md Part 5](./TESTING_GUIDE.md#part-5-explore-page-verification) |
| **Total** | **20-25 min** | [END_TO_END_TESTING.md](./END_TO_END_TESTING.md) |

---

## 📝 Feedback & Iteration

After completing tests:
1. Note any issues encountered
2. Document verification results
3. Check all items in success metrics
4. Proceed to next phase or fixes

---

**Ready to test? Start with [END_TO_END_TESTING.md](./END_TO_END_TESTING.md)** 🚀

