# ⚡ QUICK TESTING REFERENCE

## 🚀 START THE APPLICATION

### Terminal 1 - Backend Server:
```bash
cd c:\Users\ABC\OneDrive\Desktop\mahii\server
npm start
```
Expected output: `🚀 Server running on http://localhost:5000`

### Terminal 2 - Frontend:
```bash
cd c:\Users\ABC\OneDrive\Desktop\mahii\client
npm start
```
Expected output: Opens browser at `http://localhost:3000`

---

## 📋 QUICK TEST DATA

### Shop Owner Registration:
| Field | Value |
|-------|-------|
| Owner Name | Rahul Sharma |
| Email | **shopowner@test.com** |
| Phone | 9876543210 |
| Shop Name | Vadapav Express |
| Category | Stall |
| Location | Koregaon Park, Pune |
| Password | **Test@123** |

### Menu Item (Vadapav):
| Field | Value |
|-------|-------|
| Name | Vadapav (Marathi Special) |
| Price | ₹20 |
| Category | Snacks |
| Veg | ✓ Yes |
| Description | Crispy fried gram flour snack with spiced potato filling |
| Popular | ✓ Yes |

---

## 🔄 TESTING FLOW

```
Register Shop Owner
    ↓
Setup Shop Details
    ↓
Upload Shop Image
    ↓
Add Menu Items (Vadapav, etc.)
    ↓
📊 Verify on Dashboard
    ↓
✅ Admin Approves Shop
    ↓
Check Explore Page
    ↓
View Shop Details & Menu
```

---

## ✅ KEY CHECKS

- [ ] Shop appears on `/explore` page
- [ ] Shop card shows cover image
- [ ] Menu items visible in card preview
- [ ] Click shop card opens shop details
- [ ] Vadapav price shows ₹20
- [ ] Category shows as 🌮 Stall
- [ ] All menu items display on shop details page

---

## 🔧 BROWSER CONSOLE

If something doesn't work, check browser console (F12 → Console) for errors.

Common issues:
- `404 not found` → Backend endpoint issue
- `TypeError: Cannot read property` → API response issue
- `CORS error` → Backend CORS configuration
