# 🚀 Install Authentication Pages - Step by Step

## 📦 What You're Installing

**Package A: Complete Authentication System**
- Sign Up Page
- Login Page  
- Dashboard Page
- Updated Homepage with Auth buttons

---

## ⚡ Quick Install (3 Commands)

```bash
# 1. Navigate to your frontend folder
cd agrobridge/frontend/src/app

# 2. Create the page directories
mkdir -p signup login dashboard

# 3. Download the page files (I'll provide them below)
```

---

## 📥 Files You Need

I'm creating **4 files** for you. Each file goes in a specific location.

---

### Where Each File Goes:

```
frontend/src/app/
├── page.tsx                 ← REPLACE (adds auth buttons)
├── signup/
│   └── page.tsx            ← NEW FILE  
├── login/
│   └── page.tsx            ← NEW FILE
└── dashboard/
    └── page.tsx            ← NEW FILE
```

---

## ✅ Installation Checklist

- [ ] Backend is running (`docker-compose up`)
- [ ] Frontend folder exists
- [ ] Created `signup`, `login`, `dashboard` folders
- [ ] Downloaded all 4 page files
- [ ] Placed files in correct locations
- [ ] Restarted frontend (`docker-compose restart frontend`)
- [ ] Tested: Can visit `http://localhost:3000/signup`

---

## 🧪 Test Your Installation

### Test 1: Sign Up Page Loads
```
Visit: http://localhost:3000/signup
Should see: Registration form with orange/yellow design
```

### Test 2: Can Register
```
1. Fill in the form
2. Click "Create Account"
3. Should redirect to /dashboard
```

### Test 3: Login Works
```
Visit: http://localhost:3000/login
Enter phone + password
Should redirect to dashboard
```

### Test 4: Dashboard Shows User Info
```
Visit: http://localhost:3000/dashboard
Should see: Welcome message with your name
```

---

## 🎨 What Each Page Looks Like

### Sign Up Page (`/signup`)
**Layout:** Split screen
- **Left (40%):** Registration form
  - Name, Phone, Email
  - Cluster dropdown
  - Password with strength meter
  - Confirm password
  - Create Account button
- **Right (60%):** Benefits section
  - Delivery illustration (📦😊🚚✅)
  - "We Handle All Your Food Needs" heading
  - Refined messaging about households/events/NGOs/restaurants
  - 4 benefit bullets with checkmarks
  - AJ-Fresh Farmfoods trust badge

**Colors:** Orange-50 to Yellow-50 gradient background

### Login Page (`/login`)
**Layout:** Centered form
- Phone number input
- Password input (with show/hide)
- Remember me checkbox
- Forgot password link
- Sign In button
- "Don't have an account? Sign up" link

**Colors:** White background, yellow accents

### Dashboard Page (`/dashboard`)
**Layout:** Full dashboard
- **Header:** Welcome banner, user name, logout button
- **Stats Row:** 4 cards
  - Total Orders
  - Money Saved
  - Active Cluster
  - Member Since
- **Recent Orders:** Table with last 5 orders
- **Quick Actions:** 
  - Browse Products button
  - View All Orders button
  - Edit Profile button

**Colors:** White cards on gray-50 background

---

## 🔐 How Authentication Works

### Sign Up Flow:
```
1. User fills form → 
2. POST to /api/auth/register/ → 
3. Backend creates user → 
4. Returns JWT tokens → 
5. Saved to localStorage → 
6. Redirect to /dashboard
```

### Login Flow:
```
1. User enters phone/password → 
2. POST to /api/auth/login/ → 
3. Backend verifies → 
4. Returns JWT tokens → 
5. Saved to localStorage → 
6. Redirect to /dashboard
```

### Dashboard Protection:
```
1. Page loads → 
2. Check localStorage for tokens → 
3. If no tokens → Redirect to /login → 
4. If tokens exist → Fetch user data → 
5. Display dashboard
```

---

## 🛠️ Customization Options

### Change Colors
Edit the Tailwind classes in each page:
- `bg-aj-yellow` → Your primary color
- `bg-aj-green` → Your secondary color
- `from-orange-50` → Your gradient start

### Change Required Fields
In `signup/page.tsx`, remove `required` attribute from optional fields.

### Change Redirect After Login
In both signup and login pages, change:
```javascript
window.location.href = '/dashboard'  // Change to your desired page
```

### Add Social Login
Add Google/Facebook buttons in the login/signup forms.

---

## ⚠️ Common Issues & Fixes

### Issue: "Page Not Found"
**Fix:** Make sure folder names are exactly `signup`, `login`, `dashboard` (lowercase, no spaces)

### Issue: "Cannot connect to API"
**Fix:** 
1. Check backend is running: `docker-compose ps`
2. Backend should show as "Up"
3. Try: `curl http://localhost:8000/api/clusters/`

### Issue: "CORS Error"
**Fix:** Backend needs CORS enabled. Check `backend/config/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
```

### Issue: "Tokens not saving"
**Fix:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Check Application → Local Storage → Should see 3 items

### Issue: "Old design still showing"
**Fix:**
1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Or: `docker-compose down && docker-compose up --build`

---

## 📱 Mobile Responsive

All pages are mobile-responsive:
- Sign up: Form stacks vertically on mobile, hides right side benefits
- Login: Centered, scales to screen width
- Dashboard: Cards stack vertically on mobile

---

## 🎯 Next Steps After Installation

Once authentication is working:

1. **Add to Homepage:** Update nav bar with "Sign Up" and "Login" buttons
2. **Test Everything:** Register → Login → Dashboard → Logout → Login again
3. **Add Products Page:** Browse products (Package B)
4. **Add Shopping Cart:** Add to cart functionality
5. **Add Checkout:** Complete order flow

---

## 📞 Need Help?

If stuck, check:
1. Browser console (F12) for JavaScript errors
2. Backend logs: `docker-compose logs -f backend`
3. Frontend logs: `docker-compose logs -f frontend`

---

Ready to install? Download the page files below! ⬇️
