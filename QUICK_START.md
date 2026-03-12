# ERP Switch - Quick Start Guide

Get the ERP system up and running in 5 minutes!

## Prerequisites Check

```bash
# Verify Node.js is installed (v16+)
node --version

# Verify npm is installed
npm --version
```

## Installation & Run (Two Terminal Windows)

### Terminal 1 - Backend Setup & Start

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Initialize database
npx prisma generate
npx prisma migrate dev --name init

# Seed sample data
node prisma/seed.js

# Start backend server
npm run dev
```

✅ You should see: `ERP_switch backend server running on port 3001`

### Terminal 2 - Frontend Setup & Start

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Start frontend dev server
npm run dev
```

✅ You should see: `Local: http://localhost:5173/`

## Access the Application

Open your browser:
```
http://localhost:5173
```

## Login Credentials

Choose any of these accounts:

```
Email: admin@erp.com
Password: admin123
(Full system access)

OR

Email: operator@erp.com
Password: admin123
(Production & Stock access)

OR

Email: seller@erp.com
Password: admin123
(Customer & Order access)
```

## Main Features to Explore

1. **Dashboard** - Overview metrics and low stock alerts
2. **Produtos** - Create and manage products
3. **Clientes** - Add and manage customers
4. **Pedidos** - Create orders with items
5. **Ordens de Produção** - Kanban-style production board
6. **Estoque** - Track inventory and movements
7. **Usuários** (Admin) - Manage team users

## Stop the Servers

```bash
# In both terminals, press: Ctrl + C
```

## Troubleshooting

### Port 3001 already in use
```bash
# Change backend port in backend/.env
PORT=3002
```

### Database error
```bash
# Reset database (WARNING: deletes all data)
cd backend
npx prisma migrate reset
```

### Dependencies issue
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- Read `SETUP.md` for detailed setup instructions
- Check `README.md` for complete documentation
- See `PROJECT_SUMMARY.md` for technical overview

## File Locations

- **Backend**: `/sessions/focused-magical-lamport/ERP_switch/backend`
- **Frontend**: `/sessions/focused-magical-lamport/ERP_switch/frontend`
- **Database**: `backend/dev.db`

---

That's it! You now have a fully functional ERP system running locally. 🎉
