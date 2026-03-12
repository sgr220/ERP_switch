# ERP Switch - Setup Guide

This guide will help you set up and run the ERP Switch application locally.

## Prerequisites

- **Node.js**: v16 or higher (download from https://nodejs.org/)
- **npm**: Usually comes with Node.js
- **Git**: For version control (optional)

Verify installation:
```bash
node --version
npm --version
```

## Step-by-Step Setup

### 1. Navigate to the Backend Directory

```bash
cd backend
```

### 2. Install Backend Dependencies

```bash
npm install
```

This will install all required packages:
- Express.js (web framework)
- Prisma (ORM)
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- CORS (cross-origin requests)
- dotenv (environment variables)

### 3. Initialize the Database

```bash
npx prisma generate
```

This generates the Prisma client based on the schema.

### 4. Create the Database

```bash
npx prisma migrate dev --name init
```

This will:
- Create a SQLite database file (dev.db)
- Set up all database tables
- Prompt you to name the migration (default: "init")

### 5. Seed Initial Data

```bash
node prisma/seed.js
```

This creates:
- 3 demo users (admin, operator, seller) with password `admin123`
- 3 sample products (camiseta, polo, regata)
- 2 sample customers
- 2 sample orders with items
- 2 sample production orders
- 4 sample stock items

### 6. Start the Backend Server

```bash
npm run dev
```

You should see:
```
ERP_switch backend server running on port 3001
```

Leave this terminal running.

---

### 7. Navigate to the Frontend Directory (New Terminal)

```bash
cd frontend
```

### 8. Install Frontend Dependencies

```bash
npm install
```

This will install:
- React and React DOM
- React Router (navigation)
- Axios (HTTP client)
- Tailwind CSS (styling)
- Vite (build tool)

### 9. Start the Frontend Dev Server

```bash
npm run dev
```

You should see output like:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

### Demo Credentials

Use any of these accounts to log in:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@erp.com | admin123 |
| Operator | operator@erp.com | admin123 |
| Seller | seller@erp.com | admin123 |

**Start with the ADMIN account to explore all features.**

---

## Troubleshooting

### Port Already in Use

**Backend (Port 3001)**
1. Find the process using the port: `lsof -i :3001` (Mac/Linux) or `netstat -ano | findstr :3001` (Windows)
2. Either close the process or change the PORT in `backend/.env`

**Frontend (Port 5173)**
- Vite will automatically use the next available port

### Database Connection Error

```bash
# Reset the database (WARNING: This deletes all data!)
npx prisma migrate reset
```

### npm Install Issues

```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

### Modules Not Found

Delete node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json  # Mac/Linux
rmdir /s node_modules                   # Windows

npm install
```

---

## Database Management

### View Database with Prisma Studio

```bash
cd backend
npx prisma studio
```

This opens a visual database editor in your browser.

### Reset Database (Delete All Data)

```bash
cd backend
npx prisma migrate reset
```

Confirms deletion and re-runs all migrations and seed.

### View Database Directly

SQLite database files are at:
```
backend/dev.db
```

You can open with any SQLite viewer.

---

## Project Structure

```
ERP_switch/
├── backend/                    # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/        # Business logic for each module
│   │   ├── middleware/         # Authentication middleware
│   │   └── routes/             # API endpoint definitions
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema definition
│   │   └── seed.js             # Initial data seeding
│   ├── server.js               # Express server entry point
│   ├── package.json            # Backend dependencies
│   ├── .env                    # Environment configuration
│   └── .env.example            # Environment template
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable UI components
│   │   ├── services/           # API client
│   │   ├── context/            # React Context for state
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global styles
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite build config
│   ├── tailwind.config.js      # Tailwind CSS config
│   └── postcss.config.js       # PostCSS config
│
├── README.md                   # Project documentation
├── SETUP.md                    # This file
└── .gitignore                  # Git ignore rules
```

---

## Running Scripts

### Backend

```bash
cd backend

# Development server with auto-reload
npm run dev

# Production server
npm start

# Database migrations
npm run db:migrate

# Seed database
npm run db:seed

# Open database manager (Prisma Studio)
npm run db:studio
```

### Frontend

```bash
cd frontend

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Next Steps

1. **Login** with admin@erp.com / admin123
2. **Explore Dashboard** to see sample data
3. **Try creating** a new product, customer, or order
4. **Check Production Orders** to see the Kanban board
5. **Manage Stock** and see low stock alerts
6. **Create Users** (Admin only) to set up team members

---

## Common Tasks

### Add a New User

1. Login as ADMIN
2. Go to "Usuários" (Users) in sidebar
3. Click "+ Novo Usuário"
4. Fill in name, email, password, and role
5. Click Create

### Create a Product

1. Go to "Produtos" (Products)
2. Click "+ Novo Produto"
3. Enter product details, sizes, colors, and price
4. Click Create

### Create an Order

1. Go to "Pedidos" (Orders)
2. Click "+ Novo Pedido"
3. Select customer
4. Add items from products (with size, color, quantity)
5. Set delivery date
6. Click Create

### Track Production

1. Go to "Ordens de Produção" (Production Orders)
2. View Kanban board with statuses
3. Drag items between columns or edit individual items
4. Assign responsible operator and deadline

### Manage Stock

1. Go to "Estoque" (Stock)
2. Create stock items or register movements
3. Monitor low stock alerts on dashboard
4. Track all stock movements history

---

## Production Deployment

### Environment Variables

Before deploying to production, update:

**backend/.env**
```
DATABASE_URL="postgresql://user:password@host:5432/erp_switch"
JWT_SECRET="generate-a-long-random-secret-string-here"
PORT=3001
NODE_ENV=production
```

### Build Frontend

```bash
cd frontend
npm run build
```

Deploy the `dist/` folder to your static hosting.

### Deploy Backend

Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start server.js --name "erp-switch"
pm2 save
pm2 startup
```

---

## Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review error messages in browser console (F12)
3. Check backend logs in terminal
4. Verify database is running: `npx prisma studio`

---

**Ready to go!** Start both servers and begin managing your t-shirt factory. 🎉
