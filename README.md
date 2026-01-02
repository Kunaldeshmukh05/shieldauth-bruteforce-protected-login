# 🔐 ShieldAuth - Brute-Force Protected Login System

A full-stack authentication system with advanced brute-force protection mechanisms, implementing both user-level and IP-level lockout strategies.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

---

## 🌐 Live Demo

- **Application_URL** https://shieldauth-bruteforce-protected-log.vercel.app


---

## 📋 Table of Contents

- [Features](#-features)
- [Security Mechanisms](#-security-mechanisms)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Architecture & Design](#-architecture--design)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)

---

## ✨ Features

### 🔒 Security Features
- **User-Level Lockout:** 5 failed attempts in 5 minutes → 15-minute account suspension
- **IP-Level Lockout:** 100 failed attempts from any IP in 5 minutes → 15-minute IP block
- **Sliding Window Algorithm:** Real-time attempt tracking with automatic expiry
- **Password Hashing:** Industry-standard bcrypt with salt rounds
- **Input Validation:** RFC 5322 compliant email validation, SQL injection & XSS prevention
- **CORS Protection:** Whitelist-based origin validation

### 💻 User Experience
- Beautiful, responsive UI with gradient designs
- Real-time feedback with countdown timers during lockouts
- Professional dashboard after successful login
- Clear error messages and status indicators
- Mobile-friendly interface

### 🛠️ Technical Features
- RESTful API architecture
- MongoDB Atlas for data persistence
- Comprehensive unit tests (56+ tests, 85%+ coverage)
- Production-ready deployment on Railway
- Environment-based configuration
- Graceful error handling

---

## 🛡️ Security Mechanisms

### User-Level Protection
```
Attempt 1-4: ❌ Invalid credentials
Attempt 5:   ❌ Invalid credentials
Attempt 6+:  🚫 Account suspended for 15 minutes
```

**Implementation:**
- Tracks failed attempts per email address
- Uses sliding 5-minute window
- Clears attempts on successful login
- Persists across server restarts

### IP-Level Protection
```
User A: 5 failed attempts   → User suspended ✓
User B: 40 failed attempts  → User suspended ✓
User C: 40 failed attempts  → User suspended ✓
User D: 15 failed attempts  → Total: 100
All users from IP: 🚫 IP blocked for 15 minutes
```

**Implementation:**
- Aggregates attempts across all users per IP
- Independent of user-level lockout
- Protects against distributed attacks
- Handles proxy environments (Railway, Heroku)

---

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Axios** - HTTP client
- **CSS3** - Custom styling with gradients & animations
- **Express** - Static file serving in production

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **dotenv** - Environment management
- **cors** - Cross-origin resource sharing

### Testing & DevOps
- **Jest** - Unit testing framework 
- **Railway** - Cloud deployment platform for backend 
- **Vercel** - Cloud deployment platform for frontend
- **Git & GitHub** - Version control
- **MongoDB Atlas** - Database hosting

---

## 📁 Project Structure

```
shieldauth-bruteforce-protected-login/
├── server/                          # Backend application
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # MongoDB connection
│   │   ├── controllers/
│   │   │   └── authController.js   # Authentication logic
│   │   ├── middleware/
│   │   │   ├── errorHandler.js     # Global error handling
│   │   │   └── ipExtractor.js      # Client IP extraction
│   │   ├── models/
│   │   │   ├── User.js             # User schema
│   │   │   └── IPBlock.js          # IP blocking schema
│   │   ├── routes/
│   │   │   └── authRoutes.js       # API routes
│   │   ├── services/
│   │   │   └── lockoutService.js   # Core lockout logic
│   │   ├── utils/
│   │   │   ├── constants.js        # Configuration constants
│   │   │   └── validators.js       # Input validation
│   │   └── app.js                  # Express app setup
│   ├── tests/                       # Unit tests
│   │   ├── constants.test.js
│   │   ├── lockoutService.test.js
│   │   └── validators.test.js
│   ├── server.js                    # Entry point
│   ├── package.json
│   └── README.md
│
├── client/                          # Frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginForm.jsx       # Login component
│   │   │   ├── RegisterForm.jsx    # Registration component
│   │   │   ├── Dashboard.jsx       # Protected dashboard
│   │   │   └── StatusMessage.jsx   # Error/success alerts
│   │   ├── services/
│   │   │   └── api.js              # API client (Axios)
│   │   ├── styles/
│   │   │   ├── App.css             # Global styles
│   │   │   ├── Auth.css            # Authentication styles
│   │   │   └── Dashboard.css       # Dashboard styles
│   │   ├── App.jsx                 # Main app component
│   │   └── main.jsx                # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 24+ and npm
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/shieldauth-bruteforce-protected-login.git
cd shieldauth-bruteforce-protected-login
```

#### 2. Setup Backend
```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Add your MongoDB URI and configuration
nano .env
```

**server/.env:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
CLIENT_URL=http://localhost:5173
```

#### 3. Setup Frontend
```bash
cd ../client
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

#### 4. Run Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

#### 5. Access Application
Open browser: `http://localhost:5173`

---

## 🏗️ Architecture & Design

### System Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Client    │ HTTPS   │   Backend   │  Auth   │  MongoDB    │
│  (React)    │ ──────> │  (Express)  │ ──────> │   Atlas     │
│   vercel    │         │  Render     │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
      │                        │
      │                        ├─ User Model (email, password, attempts)
      │                        ├─ IPBlock Model (ip, attempts, blocked)
      │                        └─ Lockout Service (core logic)
      │
      └─ Components: Login, Register, Dashboard
```

### Design Decisions

#### 1. **Sliding Window vs Fixed Window**
**Choice:** Sliding Window  
**Reasoning:**
- More accurate attack detection
- Prevents circumventing lockout by waiting for window reset
- Continuously evaluates last N minutes of activity

#### 2. **Timestamp Storage vs Counter**
**Choice:** Array of Timestamps  
**Reasoning:**
- Enables precise sliding window calculations
- Allows forensic analysis of attack patterns
- Automatic cleanup of old attempts

#### 3. **User + IP Dual Lockout**
**Choice:** Independent Mechanisms  
**Reasoning:**
- User lockout: Protects individual accounts
- IP lockout: Protects system from distributed attacks
- Both can trigger simultaneously for maximum security

#### 4. **MongoDB vs SQL**
**Choice:** MongoDB  
**Reasoning:**
- Flexible schema for evolving security requirements
- Better performance for high-frequency writes (attempt logging)
- Easy horizontal scaling
- Atlas provides free cloud hosting

#### 5. **bcrypt vs Other Hashing**
**Choice:** bcrypt with 10 salt rounds  
**Reasoning:**
- Industry standard for password hashing
- Built-in salt generation
- Computationally expensive (resistant to brute-force)
- Proven security track record

#### 6. **Monorepo Structure**
**Choice:** Backend + Frontend in same repository  
**Reasoning:**
- Simplified deployment and versioning
- Shared documentation
- Easier code review
- Single source of truth

---

## 📡 API Documentation

### Base URL
```
Production: https://shieldauth-bruteforce-protected-login-production.up.railway.app/api
Local: http://localhost:5000/api
```

### Endpoints

#### 1. Health Check
```http
GET /health
```
**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-02T10:00:00.000Z"
}
```

#### 2. Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "email": "user@example.com"
  }
}
```

#### 3. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "email": "user@example.com"
  }
}
```

**User Suspended (403):**
```json
{
  "success": false,
  "message": "Account temporarily suspended due to too many failed attempts.",
  "remainingTime": 847
}
```

**IP Blocked (429):**
```json
{
  "success": false,
  "message": "IP temporarily blocked due to excessive failed login attempts.",
  "remainingTime": 892
}
```

#### 4. Check Status
```http
GET /auth/status?email=user@example.com
```
**Response:**
```json
{
  "success": true,
  "data": {
    "ip": {
      "blocked": false,
      "remainingTime": 0
    },
    "user": {
      "suspended": true,
      "remainingTime": 450
    }
  }
}
```

---

## 🧪 Testing

### Run Tests
```bash
cd server
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

### Test Results
```
Test Suites: 3 passed, 3 total
Tests:       56 passed, 56 total
Coverage:    85%+ (statements, branches, functions)
```

### Test Categories
- ✅ Lockout Service (13 tests) - Core security logic
- ✅ Validators (23 tests) - Input validation & security
- ✅ Constants (20 tests) - Configuration compliance

For detailed testing documentation, see [server/README.md](./server/README.md)

---

## 🚀 Deployment

### Hosting Platform: Railway

#### Backend
- **URL:** https://shieldauth-bruteforce-protected-login-production.up.railway.app
- **Platform:** Railway
- **Database:** MongoDB Atlas
- **Region:** Auto-selected

#### Frontend
- **URL:** https://auth-frontend-production-5b0a.up.railway.app
- **Platform:** Railway
- **Deployment:** Express static file server
- **Build:** Vite production build

### Deployment Process

#### Backend Deployment
1. Push code to GitHub
2. Connect Railway to repository
3. Set root directory: `server`
4. Configure environment variables
5. Auto-deploy on push

#### Frontend Deployment
1. Same repository, separate service
2. Set root directory: `client`
3. Build command: `npm install && npm run build`
4. Start command: `npm start` (Express server)
5. Auto-deploy on push

For detailed deployment guide, see:
- [server/README.md](./server/README.md#deployment)
- [client/README.md](./client/README.md#deployment)

---

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
CLIENT_URL=https://your-frontend-url.up.railway.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

---

## 📸 Screenshots

### Login Page
Beautiful gradient design with security features displayed.

### Registration
Simple, secure user registration with validation.

### Dashboard
Professional dashboard showing security features and system info.

### Lockout Alert
Real-time countdown when account is suspended.

*(Add actual screenshots to `/docs/screenshots/` folder)*

---

## 📊 Key Metrics

| Metric | Value |
|--------|-------|
| User Lockout Threshold | 5 attempts in 5 minutes |
| User Suspension Duration | 15 minutes |
| IP Lockout Threshold | 100 attempts in 5 minutes |
| IP Block Duration | 15 minutes |
| Password Hash Rounds | 10 (bcrypt) |
| Test Coverage | 85%+ |
| API Response Time | < 100ms (avg) |

---

## 🤝 Contributing

This is a portfolio/assignment project. For improvements or suggestions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - Feel free to use this project for learning purposes.

---

## 👤 Author

**Your Name**
- GitHub: [@yKunaldeshmuk05](https://github.com/Kunaldeshmukh05)
- LinkedIn: [Your Profile](https://www.linkedin.com/in/kunal-deshmukh-352147234/)


---

## Support

For questions or issues:
- Open an issue on GitHub
- Contact: kunalm.deshmukh05@gmail.com

---

**Built with ❤️ for secure authentication**