# Quick Start - Shop Edit Approval Workflow

## What Was Implemented

A complete shop edit approval system where:
1. **Shop owners** submit changes that need admin approval
2. **Admins** review and approve/reject the changes  
3. **Changes only go live after approval**

---

## For Shop Owners

### How to Edit Your Shop

1. **Click "Edit Shop"** button on dashboard
2. **Modal opens** with all editable fields:
   - Shop Name
   - Description
   - Category
   - Contact Number
   - Cost for Two
   - Pure Veg checkbox
   - Operating Hours
   - Facilities

3. **Make changes** - Form tracks what you modified
4. **Click "Submit for Approval"** button
5. **Wait for admin review** - Typically 24 hours
6. **Check dashboard status** - Shows if approved/rejected/pending

### What You'll See

- **Green banner**: ✅ All changes approved, shop is live
- **Yellow banner**: ⏳ Changes pending approval (shows what's pending)
- **Red notification**: ❌ Changes were rejected (shows reason)

---

## For Admins

### How to Review & Approve Changes

1. **Open Admin Panel** → "Shop Edit Reviews" section
2. **See list** of pending shop edits with change previews
3. **For each shop**, choose:
   - **View Details** - See full side-by-side comparison
   - **Approve** - Apply changes immediately (shop goes live)
   - **Reject** - Send rejection reason to shop owner

### What Admin Sees

For each pending edit:
- Shop owner name & email
- Submission date/time
- Quick preview of changes
- Current vs Proposed values comparison
- Action buttons

---

## API Reference

### Shop Owner API Calls

```javascript
// Submit edits for approval
shopAPI.submitEditForApproval(shopId, {
  name: "New Shop Name",
  description: "New description",
  costForTwo: 400,
  timings: { open: "09:00", close: "23:00" },
  // ... other fields
})

// Get edit history
shopAPI.getEditHistory(shopId)
```

### Admin API Calls

```javascript
// Get all pending edits
shopAPI.getPendingShopEdits()

// Approve an edit
shopAPI.approveShopEdit(shopId, {
  adminNotes: "Looks good!"
})

// Reject an edit
shopAPI.rejectShopEdit(shopId, {
  rejectionReason: "Please provide more details"
})
```

---

## Key Components

### Frontend Components

1. **ShopEditForm.jsx** - Edit modal for shop owners
   - Track changes made
   - Show what's being submitted
   - Submit button only active if changes exist

2. **PendingEditStatus.jsx** - Dashboard status indicator
   - Green: All approved
   - Yellow: Pending approval
   - Shows pending fields

3. **AdminEditApprovalsPanel.jsx** - Admin review interface
   - List all pending edits
   - View details modal
   - Approve/Reject modals

### Backend Endpoints

| Method | Endpoint | Role | Purpose |
|--------|----------|------|---------|
| POST | `/shops/:id/submit-edit` | Shop Owner | Submit changes for approval |
| GET | `/shops/:id/edit-history` | Shop Owner | View edit history |
| GET | `/shops/admin/pending-edits` | Admin | List pending edits |
| POST | `/shops/admin/:id/approve-edit` | Admin | Approve an edit |
| POST | `/shops/admin/:id/reject-edit` | Admin | Reject an edit |

---

## How It Works - Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ Shop Owner                                              │
│ • Dashboard → Edit Shop button                          │
│ • Opens ShopEditForm modal                              │
│ • Changes fields and clicks Submit                      │
│ • Changes stored as "pending"                           │
│ • Status shows: ⏳ Pending Admin Approval              │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ Notification sent to admin
                   ↓
┌─────────────────────────────────────────────────────────┐
│ Admin                                                   │
│ • Admin Panel → Edit Approvals section                  │
│ • Sees pending changes (yellow banner)                  │
│ • Can View Details or take action                       │
│                                                          │
│ Option A: Click "Approve"                               │
│ • Changes applied to shop immediately                   │
│ • shop.pendingEdits cleared                             │
│ • Shop live on Explore page                             │
│ • Notification sent: "Changes approved"                 │
│                                                          │
│ Option B: Click "Reject"                                │
│ • Modal opens for rejection reason                      │
│ • Changes NOT applied                                   │
│ • Notification sent with reason                         │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────────┐
│ Shop Owner (After Admin Decision)                       │
│                                                          │
│ If Approved:                                             │
│ • Dashboard shows: ✅ All changes approved               │
│ • Shop visible on Explore with new details              │
│                                                          │
│ If Rejected:                                             │
│ • Dashboard shows reason                                │
│ • Can edit again and resubmit                           │
└─────────────────────────────────────────────────────────┘
```

---

## Database Changes

Added to Shop model:
- `pendingEdits` - Stores submitted changes (waiting approval)
- `hasPendingEdits` - Boolean flag (for fast queries)
- `editSubmittedAt` - When changes were submitted
- `editEditHistory` - Audit trail of all edit submissions

---

## Testing the Workflow

### 1. Test as Shop Owner
```
1. Login as shop owner
2. Go to dashboard
3. Click "Edit Shop"
4. Change shop name
5. Click "Submit for Approval"
6. Should see: "Changes submitted for admin approval"
7. Status should show yellow/pending badge
```

### 2. Test as Admin
```
1. Login as admin
2. Go to admin panel → Edit Approvals
3. Should see the shop owner's pending edit
4. Click "View Details"
5. See comparison of old vs new values
6. Click "Approve" or "Reject"
7. Send appropriate notification
```

### 3. Verify Changes Applied
```
After approval:
- Go back to shop owner dashboard
- Status should show green/approved
- Edit another field and resubmit
- Admin can reject with specific reason
```

---

## Important Notes

✅ **Shop changes require admin approval** before going live
✅ **Shop owners notified** of approval/rejection status  
✅ **Admin can see all changes** before approving
✅ **Edit history tracked** - Audit trail of all edits
✅ **Notifications sent** - Both to shop owner and admins
✅ **Can resubmit** - After rejection, shop owner can try again

❌ **Can't change**: Shop owner ID, approval status (admin only), shop ID
❌ **Admin edits**: Bypass the approval workflow (direct update)

---

## Files to Know

### Backend Files
- `server/models/Shop.js` - Schema with pending edits fields
- `server/controllers/shopController.js` - Edit approval logic
- `server/routes/shopRoutes.js` - New edit approval endpoints

### Frontend Files  
- `client/src/components/shop/ShopEditForm.jsx` - Edit modal
- `client/src/components/shop/PendingEditStatus.jsx` - Status badge
- `client/src/components/admin/AdminEditApprovalsPanel.jsx` - Admin UI
- `client/src/pages/shopowner/ShopDashboard.jsx` - Integrated components
- `client/src/services/api.js` - API methods

---

## Next Steps

1. ✅ **All components are ready**
2. 🔄 **Test the workflow** (shop owner → submit → admin → approve)
3. 📋 **Create admin panel page** to embed AdminEditApprovalsPanel
4. 🔔 **Verify notifications** are being sent
5. 📊 **Monitor edit submissions** via admin analytics

---

## Do You Need Help With?

- Creating admin page with edit approvals?
- Setting up notification UI?
- Integrating with existing admin dashboard?
- Understanding any specific component?
- Testing the workflow?

Let me know! 🚀
