# 🇮🇳 Indian Government Scheme Recommendation Backend

A production-ready REST API that helps Indian citizens discover and get personalized recommendations for government welfare schemes.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy and configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 3. Seed the database (optional but recommended)
npm run seed

# 4. Start the server
npm start

# Development mode with auto-reload
npm run dev
```

---

## 📁 Project Structure

```
govt-scheme-app/
├── server.js                   # Entry point
├── config/
│   ├── db.js                   # MongoDB connection
│   └── constants.js            # App-wide enums and constants
├── models/
│   ├── User.js                 # User model (auth + profile)
│   └── Scheme.js               # Government scheme model (multi-lang)
├── controllers/
│   ├── authController.js       # Register, login, getMe
│   ├── userController.js       # Profile CRUD, saved schemes
│   ├── schemeController.js     # Scheme CRUD + search
│   └── recommendationController.js  # Eligibility matching engine
├── routes/
│   ├── auth.js
│   ├── user.js
│   ├── schemes.js
│   └── recommendations.js
├── middleware/
│   ├── auth.js                 # JWT protect + authorize + optionalAuth
│   ├── errorHandler.js         # Global error handler
│   └── validate.js             # express-validator error formatter
├── utils/
│   ├── AppError.js             # Custom operational error class
│   ├── catchAsync.js           # Async wrapper
│   ├── apiFeatures.js          # Pagination/sort/filter helpers
│   ├── recommendationEngine.js # Core eligibility matching logic
│   └── validators.js           # Reusable validator chains
└── seed/
    ├── schemes.data.js         # 10 realistic Indian govt schemes
    └── seeder.js               # Seed / destroy script
```

---

## 🔐 Authentication

All protected routes require a JWT Bearer token in the header:
```
Authorization: Bearer <your_token>
```

---

## 📡 API Reference

### AUTH

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, receive JWT |
| GET | `/api/auth/me` | Private | Get current user |

#### Register payload:
```json
{
  "name": "Ramesh Kumar",
  "email": "ramesh@example.com",
  "password": "Test@1234",
  "age": 38,
  "gender": "male",
  "annualIncome": 85000,
  "occupation": "farmer",
  "state": "Uttar Pradesh",
  "category": "OBC",
  "educationLevel": "primary",
  "preferredLanguage": "hi"
}
```

---

### USER

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/user/profile` | Private | Get own profile |
| PUT | `/api/user/profile` | Private | Update profile |
| DELETE | `/api/user/profile` | Private | Deactivate account |
| GET | `/api/user/all` | Admin | List all users |
| POST | `/api/user/saved-schemes/:schemeId` | Private | Save a scheme |
| DELETE | `/api/user/saved-schemes/:schemeId` | Private | Remove saved scheme |

---

### SCHEMES

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/schemes` | Public | List all active schemes |
| GET | `/api/schemes/:id` | Public | Get scheme by ID |
| POST | `/api/schemes` | Admin | Create new scheme |
| PUT | `/api/schemes/:id` | Admin | Update scheme |
| DELETE | `/api/schemes/:id` | Admin | Soft-delete scheme |
| GET | `/api/schemes/search?q=keyword` | Public | Full-text search |
| GET | `/api/schemes/categories` | Public | Category counts |

#### Query Parameters (GET /api/schemes):
| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `category` | string | `farmer` | Filter by category |
| `lang` | string | `hi` | Response language (en/hi/mr/ta/kn/pa) |
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Results per page (max 50) |
| `sort` | string | `-createdAt` | Sort field |

---

### RECOMMENDATIONS

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/recommendations` | Private | Personalized recommendations |
| GET | `/api/recommendations/summary` | Private | Stats: counts per category |
| GET | `/api/recommendations/check/:schemeId` | Private | Check single scheme eligibility |

#### Recommendation query params:
| Param | Type | Description |
|-------|------|-------------|
| `lang` | string | Response language |
| `category` | string | Filter by scheme category |
| `page` | number | Page |
| `limit` | number | Per page |

---

## 🌐 Supported Languages

| Code | Language |
|------|----------|
| `en` | English (default) |
| `hi` | Hindi |
| `mr` | Marathi |
| `ta` | Tamil |
| `kn` | Kannada |
| `pa` | Punjabi |

---

## 🏛️ Scheme Categories

`banking` · `farmer` · `education` · `senior_citizen` · `employment` · `women_child` · `healthcare` · `housing` · `other`

---

## 🧪 Seeded Test Accounts

| Email | Password | Profile |
|-------|----------|---------|
| `admin@govtschemes.in` | `Admin@123456` | Admin (Delhi) |
| `ramesh.farmer@test.com` | `Test@1234` | Farmer, OBC, UP |
| `priya.student@test.com` | `Test@1234` | Student, SC, Maharashtra |
| `suresh.self@test.com` | `Test@1234` | Self-employed, General, TN |
| `lakshmi.homemaker@test.com` | `Test@1234` | Homemaker, ST, Karnataka |

---

## ⚙️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection URI | — |
| `JWT_SECRET` | JWT signing secret | — |
| `JWT_EXPIRE` | JWT expiry | `7d` |
| `ADMIN_EMAIL` | Seed admin email | `admin@govtschemes.in` |
| `ADMIN_PASSWORD` | Seed admin password | `Admin@123456` |

---

## 📦 Dependencies

- **express** — Web framework
- **mongoose** — MongoDB ODM
- **bcryptjs** — Password hashing
- **jsonwebtoken** — JWT auth
- **express-validator** — Input validation
- **helmet** — Security headers
- **cors** — Cross-origin requests
- **express-rate-limit** — Rate limiting
- **morgan** — HTTP logging
- **dotenv** — Env config
