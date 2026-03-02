# 🎨 Package A: Authentication Pages - Complete Guide

## 📦 What's Included

This package contains **3 new pages** + **1 updated homepage** to give you full authentication:

1. **Sign Up Page** (`/signup`) - Colorful split-screen registration
2. **Login Page** (`/login`) - Simple, clean login form  
3. **Dashboard Page** (`/dashboard`) - User dashboard after login
4. **Updated Homepage** - With "Sign Up" and "Login" buttons

---

## 📂 File Structure

You need to create these folders in your `agrobridge/frontend/src/app/` directory:

```
frontend/src/app/
├── page.tsx (UPDATE THIS - add login/signup buttons)
├── signup/
│   └── page.tsx (NEW)
├── login/
│   └── page.tsx (NEW)
└── dashboard/
    └── page.tsx (NEW)
```

---

## 🎯 Refined Messaging

**Your "What We Do" statement (now on signup page):**

"From households to events, NGOs to restaurants, humanitarian missions to individual orders—we aggregate the best prices, source from verified vendors, and deliver with excellence."

---

## 📝 Files to Create

### FILE 1: `/signup/page.tsx`

**Features:**
- ✅ Colorful split-screen design
- ✅ Left: Registration form
- ✅ Right: Benefits with delivery illustration
- ✅ Password strength indicator
- ✅ Cluster selection dropdown (from API)
- ✅ Real-time validation
- ✅ Connects to backend `/api/auth/register/`
- ✅ Stores JWT tokens in localStorage
- ✅ Redirects to dashboard on success

**Design:**
- Orange/yellow gradient background
- Food delivery emojis (📦😊🚚✅)
- "Stress-Free Delivery" floating badge
- 4 benefit points with checkmarks
- AJ-Fresh Farmfoods trust badge

### FILE 2: `/login/page.tsx`

**Features:**
- ✅ Simple, centered login form
- ✅ Phone number + password
- ✅ "Remember me" checkbox
- ✅ Forgot password link
- ✅ Connects to backend `/api/auth/login/`
- ✅ Stores JWT tokens
- ✅ Redirects to dashboard

**Design:**
- Clean white background
- Colorful accent border
- Minimal, focused on the task

### FILE 3: `/dashboard/page.tsx`

**Features:**
- ✅ Welcome message with user name
- ✅ Quick stats (Total Orders, Savings, etc.)
- ✅ Recent orders list
- ✅ Quick action buttons
- ✅ Logout button
- ✅ Protected route (redirects to login if not authenticated)

**Design:**
- Clean dashboard cards
- Stat widgets
- "Start Shopping" CTA
- Top navigation with user menu

### FILE 4: Update `/page.tsx` (Homepage)

**Add to navigation:**
- "Sign Up" button
- "Login" button
- Update all "Order Now" buttons to point to `/signup` for new users

---

## 🔐 Authentication Flow

```
1. User visits homepage (/)
2. Clicks "Sign Up" → Goes to /signup
3. Fills form → Backend creates account → Returns JWT tokens
4. Tokens stored in localStorage
5. Auto-redirect to /dashboard
6. Dashboard checks for tokens → Shows user info
7. User can logout → Tokens deleted → Redirect to home
```

---

## 💾 LocalStorage Structure

```javascript
localStorage.setItem('accessToken', 'jwt-access-token-here')
localStorage.setItem('refreshToken', 'jwt-refresh-token-here')
localStorage.setItem('user', JSON.stringify({
  id: 1,
  name: 'John Doe',
  phone: '08012345678',
  email: 'john@example.com',
  cluster: { id: 1, name: 'ESUT - Agbani' }
}))
```

---

## 🎨 Design Specifications

### Colors
- **Primary**: `#FFD700` (AJ Yellow)
- **Secondary**: `#2D5016` (AJ Green)
- **Accent**: `#FB923C` (Orange)
- **Text**: `#111827` (Gray 900)
- **Background**: `#FFFFFF` (White)
- **Gradient**: `from-orange-50 via-yellow-50 to-orange-100`

### Typography
- **Headings**: Bold, 2xl-4xl
- **Body**: Regular, base-lg
- **Labels**: Semibold, sm

### Components
- **Input Fields**: Border, rounded-lg, focus ring
- **Buttons**: Gradient, rounded-lg, shadow
- **Cards**: White background, shadow-lg, rounded-2xl

---

## 🚀 How to Implement

### Step 1: Create the Directories

```bash
cd agrobridge/frontend/src/app
mkdir signup login dashboard
```

### Step 2: Download the Files

I'll create individual files for you to download.

### Step 3: Copy Files

- Place `signup/page.tsx` in `frontend/src/app/signup/`
- Place `login/page.tsx` in `frontend/src/app/login/`
- Place `dashboard/page.tsx` in `frontend/src/app/dashboard/`
- Replace `page.tsx` with updated homepage

### Step 4: Restart Frontend

```bash
docker-compose restart frontend
```

Or rebuild:

```bash
docker-compose down
docker-compose up --build frontend
```

### Step 5: Test the Flow

1. Go to `http://localhost:3000`
2. Click "Sign Up"
3. Fill the form
4. Get redirected to dashboard
5. Logout works
6. Login works

---

## 🧪 API Endpoints Used

### Sign Up
```
POST http://localhost:8000/api/auth/register/
Body: {
  name, phone, email, password, password_confirm, cluster
}
Response: {
  user: {...},
  tokens: { access, refresh }
}
```

### Login
```
POST http://localhost:8000/api/auth/login/
Body: {
  phone, password
}
Response: {
  user: {...},
  tokens: { access, refresh }
}
```

### Get User Profile
```
GET http://localhost:8000/api/auth/profile/
Headers: {
  Authorization: Bearer {accessToken}
}
Response: {
  user: {...}
}
```

---

## 📸 What You'll See

### Sign Up Page
- **Left**: Registration form with 6 fields
- **Right**: Orange gradient box with delivery emojis and benefits

### Login Page
- **Center**: Simple login form
- Phone + Password
- Clean, minimal

### Dashboard
- **Top**: Welcome banner with user name
- **Middle**: 4 stat cards (Orders, Savings, etc.)
- **Bottom**: Recent orders table
- **Sidebar**: Quick actions

---

## ✨ Key Features

1. **Real API Integration** - Not just UI, connects to your backend
2. **JWT Authentication** - Industry-standard security
3. **Protected Routes** - Dashboard only accessible when logged in
4. **Persistent Login** - Tokens stored, stays logged in on refresh
5. **Error Handling** - Shows errors from API
6. **Loading States** - Shows "Loading..." during API calls
7. **Form Validation** - Password strength, matching passwords, required fields
8. **Responsive Design** - Works on mobile, tablet, desktop

---

## 🔄 Next Steps (After Package A)

Once this is working, you can add:

**Package B - Shopping:**
- Products browsing page
- Product detail page
- Shopping cart
- Checkout flow
- Order confirmation

**Package C - Advanced:**
- Order history page
- Order tracking
- Profile editing
- Admin dashboard
- Vendor portal

---

## 🆘 Troubleshooting

### "Cannot reach backend"
- Make sure backend is running: `docker-compose ps`
- Check API URL is `http://localhost:8000`

### "CORS error"
- Backend should have CORS enabled for `http://localhost:3000`
- Check `backend/config/settings.py` - `CORS_ALLOWED_ORIGINS`

### "Tokens not saving"
- Check browser console for errors
- Make sure localStorage is enabled
- Try incognito mode

### "Page not found"
- Make sure folders are named exactly: `signup`, `login`, `dashboard`
- Each folder needs a `page.tsx` file

---

I'll now create the actual code files for you to download! 🚀
