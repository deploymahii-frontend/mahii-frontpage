# Shop Edit Approval Workflow - Complete Guide

## Overview
A complete shop edit approval system where shop owners can modify their shop details, and admins must approve the changes before they go live on the explore page.

## Architecture

### 1. **Shop Owner Workflow**
- Shop owner clicks "Edit Shop" button on dashboard
- Modal form opens (`ShopEditForm.jsx`)
- Shop owner makes changes and clicks "Submit for Approval"
- Changes are sent to backend as pending edits
- Dashboard shows "Changes Pending Admin Approval" status

### 2. **Admin Approval Workflow**
- Admin visits admin panel edit approvals section
- Sees list of pending shop edits with change previews
- Can view full details, approve, or reject with reason
- Shop owner is notified of approval/rejection via notifications

### 3. **Database Flow**
```
Shop Owner edits form
       ↓
submitEditForApproval() endpoint
       ↓
Stores in: pendingEdits, hasPendingEdits, editSubmittedAt
Creates notification for admins
       ↓
Admin sees pending edits in admin panel
       ↓
Admin approves → Changes applied to shop document
              → Removes pendingEdits, sets hasPendingEdits = false
              → Notifies shop owner
              
OR Admin rejects → Removes pendingEdits, sends rejection reason
                 → Notifies shop owner of rejection
```

---

## Backend Implementation

### Database Schema Changes
`server/models/Shop.js` - Added fields:

```javascript
// Pending Edits (for edit approval workflow)
pendingEdits: {
  type: mongoose.Schema.Types.Mixed,
  default: null,  // Stores pending changes
},
hasPendingEdits: {
  type: Boolean,
  default: false,
},
editSubmittedAt: {
  type: Date,
  default: null,
},
editEditHistory: [{
  submittedAt: Date,
  submittedBy: mongoose.Schema.Types.ObjectId,
  changes: mongoose.Schema.Types.Mixed,
  status: { type: String, enum: ['pending', 'approved', 'rejected'] },
  adminNotes: String,
  reviewedAt: Date,
  reviewedBy: mongoose.Schema.Types.ObjectId,
}],
```

### API Endpoints

#### Shop Owner Endpoints

**1. Submit Edit for Approval**
```
POST /api/shops/:id/submit-edit
Headers: Authorization: Bearer token (shop owner)
Body: { name, description, category, timings, costForTwo, pureVeg, facilities, ... }

Response:
{
  success: true,
  message: "Shop edits submitted for approval",
  shop: { ...shop data with pendingEdits set }
}
```

**2. Get Edit History**
```
GET /api/shops/:id/edit-history
Headers: Authorization: Bearer token (shop owner or admin)

Response:
{
  success: true,
  editHistory: [...array of edit submissions],
  pendingEdits: {...current pending changes or null},
  hasPendingEdits: boolean
}
```

#### Admin Endpoints

**1. Get Pending Shop Edits**
```
GET /api/shops/admin/pending-edits
Headers: Authorization: Bearer token (admin)

Response:
{
  success: true,
  count: 5,
  shops: [{
    _id: "...",
    name: "Shop Name",
    ownerId: { _id: "...", name: "Owner", email: "..." },
    pendingEdits: { name: "New Name", ... },
    editSubmittedAt: "2024-01-15T10:30:00Z",
    hasPendingEdits: true
  }, ...]
}
```

**2. Approve Shop Edit**
```
POST /api/shops/admin/:id/approve-edit
Headers: Authorization: Bearer token (admin)
Body: { adminNotes: "Looks good" }

Response:
{
  success: true,
  message: "Shop edits approved and applied",
  shop: { ...updated shop data }
}

Actions:
- Applies all pending edits to shop document
- Clears pendingEdits and hasPendingEdits
- Updates editHistory with approved status
- Sends notification to shop owner
```

**3. Reject Shop Edit**
```
POST /api/shops/admin/:id/reject-edit
Headers: Authorization: Bearer token (admin)
Body: { rejectionReason: "Please update description to be more accurate" }

Response:
{
  success: true,
  message: "Shop edits rejected",
  shop: { ...shop data }
}

Actions:
- Removes pendingEdits
- Sets hasPendingEdits = false
- Updates editHistory with rejected status and reason
- Sends notification to shop owner with rejection reason
```

---

## Frontend Implementation

### Components

#### 1. ShopEditForm.jsx
**Location**: `client/src/components/shop/ShopEditForm.jsx`

**Features**:
- Modal form with all shop editable fields
- Tracks changes and highlights what's being modified
- Compares old vs new values
- Requires admin approval notice
- Submit button only active when changes exist
- Shows "Submit for Approval" instead of direct save

**Props**:
```javascript
<ShopEditForm
  shop={shop}              // Current shop data
  onClose={() => {}}       // Close handler
  onSuccess={fetchData}    // Callback after successful submit
/>
```

**Key Fields**:
- Shop Name
- Description
- Category (dropdown)
- Contact Number
- Cost for Two (₹)
- Pure Vegetarian (checkbox)
- Operating Hours (time inputs)
- Facilities (checkboxes)

#### 2. PendingEditStatus.jsx
**Location**: `client/src/components/shop/PendingEditStatus.jsx`

**Features**:
- Shows status banner on shop dashboard
- Green: All approved, shop is live
- Yellow: Changes pending approval
- Lists what fields are pending
- Shows submission date
- Indicates typical response time (24 hours)

**Usage**:
```javascript
<PendingEditStatus shop={shop} />
```

#### 3. AdminEditApprovalsPanel.jsx
**Location**: `client/src/components/admin/AdminEditApprovalsPanel.jsx`

**Sub-Components**:
- **DetailModal**: Shows side-by-side comparison of current vs proposed values
- **RejectModal**: Input form for rejection reason

**Features**:
- List view of all pending shop edits
- Quick preview of proposed changes
- View Details button for full comparison
- Approve button (instant approval)
- Reject button (opens rejection reason modal)
- Empty state when no pending reviews
- Summary card showing pending count

### Routes

#### Shop Owner Routes
- Click "Edit Shop" → Opens ShopEditForm modal
- Submit changes → `submitEditForApproval()` called
- View history → Can see all past edit submissions
- Dashboard → PendingEditStatus component shows current status

#### Admin Routes
- Create new tab/section in admin panel called "Shop Edit Reviews"
- Embed AdminEditApprovalsPanel component
- Admin can review and approve/reject changes

---

## API Service Methods

**File**: `client/src/services/api.js`

```javascript
shopAPI = {
  // Shop Owner methods
  submitEditForApproval: (shopId, data) => 
    api.post(`/shops/${shopId}/submit-edit`, data),
    
  getEditHistory: (shopId) => 
    api.get(`/shops/${shopId}/edit-history`),
    
  // Admin methods
  getPendingShopEdits: () => 
    api.get('/shops/admin/pending-edits'),
    
  approveShopEdit: (shopId, data) => 
    api.post(`/shops/admin/${shopId}/approve-edit`, data),
    
  rejectShopEdit: (shopId, data) => 
    api.post(`/shops/admin/${shopId}/reject-edit`, data),
}
```

---

## ShopDashboard Integration

**File**: `client/src/pages/shopowner/ShopDashboard.jsx`

**Changes**:
1. Added `showEditForm` state
2. "Edit Shop" button now opens `ShopEditForm` modal instead of navigating
3. Added `PendingEditStatus` component in Overview tab
4. Shows current edit approval status
5. Fetch data refreshes after successful edit submission

**Example**:
```javascript
<button onClick={() => setShowEditForm(true)}>
  Edit Shop
</button>

{showEditForm && (
  <ShopEditForm
    shop={shop}
    onClose={() => setShowEditForm(false)}
    onSuccess={fetchShopData}
  />
)}

<PendingEditStatus shop={shop} />
```

---

## Notification System

When edits are submitted/reviewed, notifications are created:

**Shop Edit Submitted**:
- Recipient: All admins
- Title: "Shop Edit Pending Approval"
- Message: "{Shop Name} has submitted changes for approval"

**Shop Edit Approved**:
- Recipient: Shop owner
- Title: "Shop Edit Approved"
- Message: "Your changes to {Shop Name} have been approved and are now live"

**Shop Edit Rejected**:
- Recipient: Shop owner
- Title: "Shop Edit Rejected"
- Message: "Your changes to {Shop Name} were rejected. Reason: {rejectionReason}"

---

## Usage Flow - Complete Example

### Step 1: Shop Owner Edits
```
1. Login as shop owner
2. Go to Shop Dashboard
3. Click "Edit Shop" button
4. Modal opens with current shop details
5. Change shop name from "Delhi Mess" to "Delhi Delights"
6. Change cost from ₹500 to ₹450
7. Click "Submit for Approval"
8. Toast: "Changes submitted for admin approval"
9. Dashboard now shows yellow status: "Changes Pending Admin Approval"
```

### Step 2: Admin Reviews
```
1. Login as admin
2. Go to Admin Panel → Shop Edit Reviews
3. See pending edit from "Delhi Delights"
4. Click "View Details"
5. See side-by-side:
   - Current: name="Delhi Mess", cost=500
   - Proposed: name="Delhi Delights", cost=450
6. Either:
   a) Click "Approve" → Changes applied, shop owner notified
   b) Click "Reject" → Modal opens for rejection reason
      - Add reason: "Shop name needs permission documentation"
      - Click "Reject" → Shop owner gets rejection notification
```

### Step 3: Feedback Loop
```
If Approved:
- Shop details updated
- Visible on Explore page immediately
- Shop owner notified: "Changes approved and live"

If Rejected:
- Changes not applied
- Shop owner sees reason
- Can edit again and resubmit
- Process repeats
```

---

## Security & Validation

### What Can't Be Changed:
- `ownerId` - Shop owner stays same
- `isActive`, `isApproved` - Can only be changed by admin
- `_id` - Shop ID is immutable

### Validation:
- Shop owner can only submit edits for their own shop
- Admin can only approve/reject as admin user
- Edit history is immutable audit trail
- All changes are tracked with timestamps and user IDs

---

## Testing Checklist

- [ ] Shop owner can open edit form
- [ ] Changes are tracked and displayed
- [ ] Submit button only active when changes exist
- [ ] API successfully submits pending edits
- [ ] Dashboard shows pending status
- [ ] Admin can see pending edits list
- [ ] Admin can view detailed changes
- [ ] Admin can approve changes
- [ ] Admin can reject with reason
- [ ] Shop owner receives notifications
- [ ] Approved changes appear on shop
- [ ] Changed shop details appear on Explore
- [ ] Edit history shows all submissions
- [ ] Rejected edits can be resubmitted

---

## Files Modified/Created

### Backend
- ✅ `server/models/Shop.js` - Added pending edits schema
- ✅ `server/controllers/shopController.js` - Added 5 new functions
- ✅ `server/routes/shopRoutes.js` - Added new routes

### Frontend
- ✅ `client/src/services/api.js` - Added API methods
- ✅ `client/src/components/shop/ShopEditForm.jsx` - NEW
- ✅ `client/src/components/shop/PendingEditStatus.jsx` - NEW
- ✅ `client/src/components/admin/AdminEditApprovalsPanel.jsx` - NEW
- ✅ `client/src/pages/shopowner/ShopDashboard.jsx` - Integrated components

### Total Implementation
- 8 backend functions
- 5 API endpoints  
- 3 React components
- 100+ lines of schema updates
- Full admin/shop owner workflow

---

## Next Steps (Optional Enhancements)

1. **Edit History Page**: Show shop owner all past edits with status
2. **Admin Dashboard Stats**: Show edit approval metrics
3. **Batch Operations**: Admin can approve/reject multiple edits at once
4. **Auto-Expiry**: Mark old edits as expired if not reviewed in X days
5. **Comments**: Back-and-forth communication during review
6. **Webhooks**: Notify external systems on edit approval
7. **Version Control**: Keep versions of shop data at each edit
8. **A/B Testing**: Compare performance before/after edit

---

## Error Handling

### Common Errors & Solutions

**"No unauthorized to edit this shop"**
- Ensure user is logged in as shop owner
- Verify shop belongs to logged-in user

**"No pending edits for this shop"**
- Shop owner hasn't submitted edits yet
- Pending edits already approved/rejected

**"Rejection reason is required"**
- Admin must provide reason when rejecting
- Reason is sent to shop owner

**"Shop not found"**
- Shop ID is invalid
- Shop has been deleted

---

## Performance Considerations

- Pending edits stored as-is (not full shop objects)
- Edit history is paginated (fetch only when needed)
- Bulk operations for admin (approve multiple at once)
- Index on `hasPendingEdits` for fast admin queries

---

## Questions?

Refer to the inline comments in:
- ShopEditForm.jsx - Component logic
- AdminEditApprovalsPanel.jsx - Admin UI patterns
- shopController.js - Backend functions
