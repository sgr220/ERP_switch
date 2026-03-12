# ERP Switch - Complete Documentation Index

## Welcome to ERP Switch!

A complete, production-ready ERP system for t-shirt factory management. Start here to navigate all documentation.

---

## Quick Navigation

### I Just Want to Run It (5 minutes)
→ Read: **QUICK_START.md**
- Copy-paste commands
- Get running immediately
- Access demo data

### I Need Detailed Setup Instructions
→ Read: **SETUP.md**
- Step-by-step installation
- Troubleshooting guide
- Database management
- Common tasks

### I Want to Understand What Was Built
→ Read: **PROJECT_SUMMARY.md**
- Complete technical overview
- File structure explanation
- Feature checklist
- Database schema details
- API endpoint reference

### I Need Full Documentation
→ Read: **README.md**
- Feature descriptions
- Tech stack details
- API endpoints
- Deployment guide
- Role-based permissions
- Support & troubleshooting

---

## Project Structure

```
/sessions/focused-magical-lamport/ERP_switch/

├── backend/                          # Node.js Express Backend
│   ├── src/
│   │   ├── controllers/              # Business logic (6 modules)
│   │   ├── middleware/               # Authentication & auth
│   │   └── routes/                   # API routes
│   ├── prisma/
│   │   ├── schema.prisma             # Database schema
│   │   └── seed.js                   # Sample data
│   ├── server.js                     # Express entry point
│   ├── package.json                  # Dependencies
│   ├── .env                          # Configuration
│   └── .env.example                  # Configuration template
│
├── frontend/                         # React + Vite Frontend
│   ├── src/
│   │   ├── pages/                    # Page components (8 pages)
│   │   ├── components/               # Reusable UI components
│   │   ├── services/                 # API client
│   │   ├── context/                  # Auth state management
│   │   ├── App.jsx                   # Router setup
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles
│   ├── index.html                    # HTML template
│   ├── package.json                  # Dependencies
│   ├── vite.config.js                # Vite config
│   ├── tailwind.config.js            # Tailwind config
│   └── postcss.config.js             # PostCSS config
│
├── Documentation Files
│   ├── README.md                     # Complete documentation
│   ├── SETUP.md                      # Installation guide
│   ├── QUICK_START.md                # 5-minute setup
│   ├── PROJECT_SUMMARY.md            # Technical overview
│   ├── INDEX.md                      # This file
│   └── .gitignore                    # Git configuration
```

---

## What's Included

### 6 Core Modules

1. **Produtos (Products)**
   - Create, edit, delete products
   - Manage sizes and colors
   - Set sale prices
   - Search functionality

2. **Clientes (Customers)**
   - Manage customer information
   - Track payment terms
   - Store addresses
   - View order history

3. **Pedidos (Orders)**
   - Create orders with multiple items
   - Manage order status workflow
   - Automatic total calculation
   - Delivery date tracking

4. **Ordens de Produção (Production Orders)**
   - Kanban-style board (4 columns)
   - Assign responsible operators
   - Track deadlines
   - Link to sales orders

5. **Estoque (Stock)**
   - Manage raw materials and finished products
   - Track stock movements
   - Low stock alerts
   - Movement history

6. **Usuários (Users)** - Admin Only
   - Create and manage users
   - Assign roles
   - Control account status

### Plus Dashboard

- Key metrics (total orders, in production, etc.)
- Low stock alerts
- Real-time statistics
- Color-coded indicators

---

## Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18 + Vite + Tailwind CSS + React Router |
| **Backend** | Node.js + Express + Prisma ORM |
| **Database** | SQLite (dev) / PostgreSQL (production) |
| **Auth** | JWT tokens + bcrypt password hashing |
| **HTTP Client** | Axios with interceptors |
| **Styling** | Tailwind CSS 3.4 |

---

## Key Features

✅ **Authentication**
- JWT-based login
- 24-hour token expiry
- Secure password hashing
- Auto-logout

✅ **Role-Based Access**
- ADMIN (full access)
- OPERATOR (production & stock)
- SELLER (customers & orders)

✅ **Complete CRUD**
- All modules support create, read, update, delete
- Soft deletes (keep data for auditing)

✅ **Search & Filter**
- Search on all list pages
- Status filtering
- Type filtering

✅ **Status Management**
- Orders: PENDING → CONFIRMED → IN_PRODUCTION → DELIVERED
- Production: PENDING → IN_PRODUCTION → COMPLETED
- Kanban board visualization

✅ **Inventory**
- Stock tracking (raw materials & finished)
- Movement history
- Low stock alerts
- Automatic updates

✅ **Professional UI**
- Dark sidebar navigation
- Light content area
- Responsive design
- Color-coded status badges
- Modal dialogs for forms
- Loading states
- Error messages

---

## Demo Credentials

After running setup, login with:

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@erp.com | admin123 |
| OPERATOR | operator@erp.com | admin123 |
| SELLER | seller@erp.com | admin123 |

**Start with ADMIN** to explore all features.

---

## Getting Started

### Step 1: Quick Setup (5 minutes)
```bash
# Backend
cd backend && npm install
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev

# Frontend (new terminal)
cd frontend && npm install
npm run dev
```

Access: `http://localhost:5173`

### Step 2: Login
Use any demo credentials above

### Step 3: Explore
- Navigate through all modules
- Create sample data
- Try Kanban board
- Check dashboard alerts

### Step 4: Customize
- Change styling in frontend/src/index.css
- Modify components in frontend/src
- Extend backend with new features

---

## Common Tasks

### Create a New Product
1. Go to "Produtos"
2. Click "+ Novo Produto"
3. Fill in details
4. Click Create

### Create an Order
1. Go to "Pedidos"
2. Click "+ Novo Pedido"
3. Select customer
4. Add items (product, size, color, qty)
5. Set delivery date
6. Click Create

### Track Production
1. Go to "Ordens de Produção"
2. View Kanban board
3. Edit items or drag between columns
4. Assign operators and deadlines

### Manage Stock
1. Go to "Estoque"
2. Create stock items
3. Record movements (IN/OUT)
4. Monitor low stock alerts

### Add Team Members
1. Go to "Usuários" (Admin only)
2. Click "+ Novo Usuário"
3. Set name, email, password, role
4. Click Create

---

## API Overview

The backend provides 25+ REST endpoints:

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user
- `GET/POST/PUT/DELETE /api/auth/users` - User management (ADMIN)

### Data Modules
- `/api/products` - Product CRUD
- `/api/customers` - Customer CRUD
- `/api/orders` - Order CRUD + status
- `/api/production-orders` - Production CRUD + status
- `/api/stock` - Stock CRUD + movements

See **README.md** for complete endpoint reference.

---

## Troubleshooting

### Port Already in Use
```bash
# Change in backend/.env
PORT=3002
```

### Database Error
```bash
# Reset database
cd backend
npx prisma migrate reset
```

### Dependencies Issue
```bash
# Reinstall
rm -rf node_modules package-lock.json
npm install
```

See **SETUP.md** for more troubleshooting tips.

---

## Production Deployment

1. Update `DATABASE_URL` to PostgreSQL
2. Set secure `JWT_SECRET`
3. Build frontend: `npm run build`
4. Deploy `dist/` folder
5. Deploy backend with process manager

See **README.md** for detailed deployment instructions.

---

## File Statistics

- **Total Files**: 47
- **Backend Files**: 16 (JS + configs)
- **Frontend Files**: 31 (JSX + CSS + configs)
- **Documentation**: 5 files
- **Project Size**: 352 KB

---

## Next Steps

1. **Right Now**: Read QUICK_START.md → Run the app
2. **Setup Questions**: Read SETUP.md
3. **Technical Details**: Read PROJECT_SUMMARY.md
4. **Complete Reference**: Read README.md
5. **Code**: Explore frontend/src and backend/src

---

## Support

- Check the relevant documentation file (see index above)
- Review browser console (F12) for errors
- Check backend terminal for logs
- Use Prisma Studio: `npx prisma studio`

---

## Version Information

- **Version**: 1.0.0
- **Status**: Complete & Production-Ready
- **Last Updated**: 2026-03-11
- **All Features**: Implemented as per specification

---

## License

Project provided as-is for use and customization.

---

### Ready to Begin?

👉 **Start Here**: QUICK_START.md (5 minutes to running app)

Or choose based on your needs:
- **I want to run it**: QUICK_START.md
- **I need help installing**: SETUP.md
- **I want technical details**: PROJECT_SUMMARY.md
- **I need complete reference**: README.md

---

**Enjoy your new ERP system! 🎉**
