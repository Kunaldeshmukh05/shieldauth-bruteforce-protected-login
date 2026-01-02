# 🎨 Frontend - Brute-Force Protected Login UI

Modern React application with beautiful UI and real-time security feedback.

---

## 📋 Overview

Single-page application (SPA) built with React and Vite, providing:
- Elegant authentication interface
- Real-time lockout feedback
- Professional dashboard
- Responsive design

---

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 5
- **HTTP Client:** Axios
- **Styling:** Custom CSS3 (gradients, animations)
- **Production Server:** Express (static file serving)
- **Deployment:** Railway

---

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── LoginForm.jsx         # Login component with lockout handling
│   │   ├── RegisterForm.jsx      # Registration with validation
│   │   ├── Dashboard.jsx         # Protected dashboard view
│   │   └── StatusMessage.jsx     # Reusable alert component
│   ├── services/
│   │   └── api.js                # Axios instance & API methods
│   ├── styles/
│   │   ├── App.css               # Global styles & variables
│   │   ├── Auth.css              # Login/Register styling
│   │   └── Dashboard.css         # Dashboard layout & cards
│   ├── App.jsx                   # Root component with routing logic
│   └── main.jsx                  # React entry point
├── public/
│   └── vite.svg                  # App icon
├── dist/                          # Build output (generated)
├── server.js                      # Production Express server
├── index.html                     # HTML template
├── vite.config.js                 # Vite configuration
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend server running

### Installation

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Setup environment
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### Development

```bash
# Start dev server with hot reload
npm run dev

# Opens on http://localhost:5173
```

### Production Build

```bash
# Build optimized bundle
npm run build

# Preview production build locally
npm run preview

# Serve with Express (for deployment)
npm start
```

---

## 🎨 Features

### Authentication Flow

**1. Registration**
- Email format validation (RFC 5322)
- Password strength requirements (min 6 chars)
- Confirm password matching
- Real-time error feedback
- Auto-redirect to login on success

**2. Login**
- Credential verification
- Real-time lockout detection
- Countdown timer during suspension
- Clear error messages
- Persistent session (localStorage)

**3. Dashboard**
- Welcome card with user email
- Security features showcase
- System statistics
- Tech stack display
- Feature highlights

### UI/UX Highlights

**Design:**
- Purple gradient background
- Glassmorphic cards
- Smooth animations
- Responsive layout (mobile-first)
- Professional typography

**Interactions:**
- Loading states on buttons
- Form validation feedback
- Status messages with icons
- Countdown timers
- Hover effects

**Accessibility:**
- Semantic HTML
- Proper labels
- Keyboard navigation
- Color contrast (WCAG AA)
- Screen reader friendly

---

## 🔌 API Integration

### Service Layer

**File:** `src/services/api.js`

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Axios instance with base config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API methods
export const register = (email, password) => { /* ... */ };
export const login = (email, password) => { /* ... */ };
export const getStatus = (email) => { /* ... */ };
```

### Error Handling

```javascript
try {
  const response = await login(email, password);
  // Handle success
} catch (error) {
  // HTTP 401: Invalid credentials
  // HTTP 403: User suspended
  // HTTP 429: IP blocked
  const message = error.response?.data?.message;
  const remainingTime = error.response?.data?.remainingTime;
  // Display to user
}
```

---

## 🎭 Components

### LoginForm.jsx

**Purpose:** User authentication with brute-force feedback

**Features:**
- Email & password inputs
- Form validation
- Lockout detection (user + IP)
- Countdown timer display
- Switch to registration
- Security notice

**States:**
```javascript
{
  email: string,
  password: string,
  loading: boolean,
  status: {
    type: 'success' | 'error' | 'warning',
    message: string,
    remainingTime: number
  }
}
```

### RegisterForm.jsx

**Purpose:** New user account creation

**Features:**
- Email & password inputs
- Password confirmation
- Client-side validation
- Auto-redirect on success
- Switch to login

**Validation:**
- Email format check
- Password length (≥6 chars)
- Passwords match
- Real-time feedback

### Dashboard.jsx

**Purpose:** Protected view after successful login

**Features:**
- Welcome card with user info
- Security feature cards (4 cards)
- System statistics (4 metrics)
- Features list (6 items)
- Tech stack badges
- Logout functionality

**Layout:**
- Header with logout button
- Welcome section
- Info grid (responsive)
- Features section
- Stats section
- Tech stack section

### StatusMessage.jsx

**Purpose:** Reusable alert component

**Props:**
```javascript
{
  type: 'success' | 'error' | 'warning' | 'info',
  message: string,
  remainingTime?: number  // Optional countdown
}
```

**Features:**
- Color-coded by type
- Icon display
- Time formatting (minutes:seconds)
- Slide-in animation

---

## 🎨 Styling

### CSS Architecture

**App.css** - Global
- CSS variables (colors, spacing)
- Reset & base styles
- Button styles
- Status message styles

**Auth.css** - Authentication
- Gradient background
- Auth box card
- Form styles
- Animations

**Dashboard.css** - Dashboard
- Header styling
- Card layouts
- Grid systems
- Responsive breakpoints

### Design System

**Colors:**
```css
--primary-color: #6366f1;      /* Indigo */
--primary-dark: #4f46e5;
--primary-light: #818cf8;
--success-color: #10b981;      /* Green */
--error-color: #ef4444;        /* Red */
--warning-color: #f59e0b;      /* Amber */
```

**Typography:**
- Font: Inter (Google Fonts)
- Headings: 700 weight
- Body: 400-600 weight
- Line height: 1.6

**Spacing:**
- Base unit: 8px
- Padding: 16px, 24px, 32px, 40px
- Margins: 8px, 16px, 24px, 32px

**Shadows:**
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
--shadow-xl: 0 20px 25px rgba(0,0,0,0.1);
```

---

## 🚀 Deployment

### Railway Deployment

**Platform:** Railway  
**URL:** https://auth-frontend-production-5b0a.up.railway.app

#### Setup Steps

**1. Production Build Configuration**

Install Express for static file serving:
```bash
npm install express
```

Create `server.js`:
```javascript
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5173;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend running on port ${PORT}`);
});
```

Update `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "start": "node server.js"
  }
}
```

**2. Railway Configuration**

- **Root Directory:** `client`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

**3. Environment Variables**

```env
VITE_API_URL=https://shieldauth-bruteforce-protected-login-production.up.railway.app/api
PORT=5173
NODE_ENV=production
```

**4. Deploy**

- Push to GitHub
- Railway auto-deploys
- Build takes ~3 minutes
- Check logs for errors

#### Verify Deployment

```bash
# Health check (via backend)
curl https://shieldauth-bruteforce-protected-login-production.up.railway.app/health

# Open frontend
open https://auth-frontend-production-5b0a.up.railway.app
```

---

## ⚙️ Configuration

### Environment Variables

**.env (Development):**
```env
VITE_API_URL=http://localhost:5000/api
```

**.env.production (Production):**
```env
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

**Note:** `VITE_` prefix is required for Vite to expose variables to browser!

### Vite Configuration

**vite.config.js:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
```

---

## 🎯 User Flows

### Registration Flow
```
1. User lands on login page
2. Clicks "Sign Up"
3. Enters email & password
4. Validates client-side
5. Submits to API
6. Success → Auto-redirect to login (2s delay)
7. Error → Display message
```

### Login Flow (Success)
```
1. User enters credentials
2. Submits to API
3. Backend verifies
4. Success → Save to localStorage
5. Redirect to Dashboard
6. Show welcome message
```

### Login Flow (Lockout)
```
1. User fails login 5 times
2. 6th attempt → Backend returns 403
3. Frontend displays:
   - "Account suspended" message
   - Countdown timer (15:00 → 0:00)
   - Updates every second
4. After 15 minutes:
   - Timer expires
   - User can retry login
```

### Logout Flow
```
1. User clicks "Logout" in dashboard
2. Clear localStorage
3. Reset app state
4. Redirect to login page
```

---

## 🐛 Debugging

### Browser DevTools

**Console:**
- Check for JavaScript errors
- API call logs (axios)
- State updates

**Network Tab:**
- Verify API requests
- Check status codes
- Inspect request/response

**Application Tab:**
- View localStorage
- Check stored user data

### Common Issues

**API calls failing (404)**
```
Error: Request failed with status code 404
```
**Solution:**
- Verify `VITE_API_URL` is correct
- Check backend is running
- Ensure `/api` is NOT double-added

**CORS errors**
```
Access to XMLHttpRequest blocked by CORS
```
**Solution:**
- Backend must have frontend URL in `CLIENT_URL`
- Check Railway environment variables
- Redeploy backend after updating

**White screen after deployment**
```
Application shows blank page
```
**Solution:**
- Check browser console for errors
- Verify build completed successfully
- Check `dist/` folder exists
- Ensure `server.js` serves from `dist/`

**Environment variables not working**
```
VITE_API_URL is undefined
```
**Solution:**
- Must start with `VITE_` prefix
- Rebuild after changing `.env`
- In Railway, add to Variables tab

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile: < 768px */
@media (max-width: 768px) {
  /* Single column layout */
  /* Smaller fonts */
  /* Reduced padding */
}

/* Tablet: 768px - 1024px */
@media (min-width: 768px) {
  /* 2-column grids */
}

/* Desktop: > 1024px */
@media (min-width: 1024px) {
  /* 3-4 column grids */
  /* Max-width containers */
}
```

### Mobile Optimizations
- Touch-friendly buttons (min 44px)
- Readable font sizes (16px+)
- No hover-only interactions
- Flexible layouts (grid auto-fit)
- Viewport meta tag

---

## ⚡ Performance

### Build Optimization

**Vite automatically:**
- Tree-shaking (removes unused code)
- Minification (smaller files)
- Code splitting (lazy loading)
- Asset optimization (images, fonts)

**Build Stats:**
```
dist/assets/index-[hash].js   ~150 KB
dist/assets/index-[hash].css  ~50 KB
Total bundle size:            ~200 KB (gzipped: ~60 KB)
```

### Runtime Performance

**Metrics:**
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Lighthouse Score: 90+

**Optimizations:**
- Minimal dependencies
- CSS-only animations
- No heavy libraries
- Lazy component loading (possible improvement)

---

## 🎨 Customization

### Change Color Scheme

Edit `src/styles/App.css`:
```css
:root {
  --primary-color: #6366f1;     /* Change this */
  --success-color: #10b981;     /* And this */
  --error-color: #ef4444;       /* And this */
}
```

### Modify Security Messages

Edit `server/src/utils/constants.js` (backend):
```javascript
MESSAGES: {
  USER_SUSPENDED: 'Your custom message here',
  IP_BLOCKED: 'Your custom message here',
}
```

### Adjust Lockout Timers

Frontend automatically displays backend's `remainingTime`.  
To change duration, edit backend `constants.js`.

---

## 📝 Contributing

**Code Style:**
- Use functional components
- React Hooks for state
- CSS modules or styled-components (if adding)
- PropTypes for type checking

**Component Guidelines:**
- Single responsibility
- Reusable where possible
- Minimal props
- Clear naming

---

## 📞 Support

**Issues:** Open GitHub issue  
**Questions:** Check main README  
**Bugs:** Include browser console logs

---

**Frontend built with React & Vite** ⚛️