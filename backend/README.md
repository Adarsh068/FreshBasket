# FreshBasket — MERN Stack Setup Guide

## Project Structure

```
your-project/
├── project/          ← Next.js frontend (your original code)
│   ├── lib/api.ts    ← NEW: API client
│   └── ...
└── backend/          ← NEW: Express + MongoDB backend
    ├── server.js
    ├── models/
    ├── routes/
    ├── middleware/
    └── seed.js
```

---

## Step 1 — MongoDB Atlas Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create free account → New Project → Build Database → **M0 Free** tier
3. Choose region closest to you (e.g. Mumbai)
4. Create username + password (save these!)
5. **Network Access** → Add IP → `0.0.0.0/0` (allow all for dev)
6. **Connect** → Drivers → Copy the connection string

Connection string looks like:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/freshbasket?retryWrites=true&w=majority
```

---

## Step 2 — Backend Setup

```bash
cd backend

# Copy env file and fill in your values
cp .env.example .env
# Edit .env → paste your MongoDB URI, set JWT_SECRET

# Install dependencies
npm install

# Seed database with all 32 products + admin/test users
node seed.js

# Start dev server
npm run dev
# Server runs at http://localhost:5000
```

### Default seeded users:
| Role  | Email                    | Password  |
|-------|--------------------------|-----------|
| Admin | admin@freshbasket.com    | admin123  |
| User  | user@freshbasket.com     | user123   |

> ⚠️ Change these passwords after first login!

---

## Step 3 — Frontend Setup

```bash
cd project

# Copy env and set API URL
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api  (already set)

# Install dependencies
pnpm install   # or npm install

# Start frontend
pnpm dev       # or npm run dev
# Frontend runs at http://localhost:3000
```

---

## API Endpoints

### Auth
| Method | Endpoint           | Description         |
|--------|--------------------|---------------------|
| POST   | /api/auth/register | Register new user   |
| POST   | /api/auth/login    | Login, get JWT      |
| GET    | /api/auth/me       | Get current user    |

### Products
| Method | Endpoint                      | Description                |
|--------|-------------------------------|----------------------------|
| GET    | /api/products                 | All products               |
| GET    | /api/products?type=fruit      | Filter by type             |
| GET    | /api/products/search?q=mango  | Search products            |
| GET    | /api/products/:slug           | Single product by slug     |
| POST   | /api/products                 | Create product (admin)     |
| PUT    | /api/products/:id             | Update product (admin)     |
| DELETE | /api/products/:id             | Delete product (admin)     |

### Orders
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | /api/orders                 | Place new order (public) |
| GET    | /api/orders                 | All orders (admin)       |
| GET    | /api/orders/:id             | Get order by ID          |
| PATCH  | /api/orders/:id/status      | Update status (admin)    |
| DELETE | /api/orders/:id             | Delete order (admin)     |

### Subscriptions
| Method | Endpoint                        | Description                   |
|--------|---------------------------------|-------------------------------|
| POST   | /api/subscriptions              | Create subscription (public)  |
| GET    | /api/subscriptions              | All subscriptions (admin)     |
| PATCH  | /api/subscriptions/:id/status   | Update status (admin)         |
| DELETE | /api/subscriptions/:id          | Delete subscription (admin)   |

---

## Using the API client in frontend

```typescript
import { productsApi, ordersApi } from "@/lib/api"

// Fetch all fruits
const fruits = await productsApi.getAll("fruit")

// Place an order
const order = await ordersApi.create({
  customerName: "John",
  phone: "9876543210",
  address: "123 Main St",
  city: "Mumbai",
  pincode: "400001",
  payment: "cod",
  items: [...cartItems],
  subtotal: 500,
  deliveryFee: 40,
  total: 540,
})
```

---

## Health Check

Visit: `http://localhost:5000/api/health`

Should return: `{ "status": "OK", "time": "..." }`
