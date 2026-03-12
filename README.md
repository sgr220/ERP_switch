# ERP Switch - T-Shirt Factory Management System

A complete full-stack Enterprise Resource Planning (ERP) system designed for small t-shirt manufacturing factories. Built with React + Vite for the frontend and Node.js + Express for the backend, using SQLite for development and compatible with PostgreSQL for production.

## Features

### Core Modules

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (ADMIN, OPERATOR, SELLER)
   - Secure password management with bcrypt

2. **Produtos (Products)**
   - Complete CRUD operations
   - Product types: T-shirt, Polo, Regata
   - Multiple sizes and colors per product
   - Sale price management

3. **Clientes (Customers)**
   - Customer management with CRUD operations
   - Support for CPF/CNPJ documents
   - Payment terms and delivery address tracking
   - Order history per customer

4. **Pedidos (Orders)**
   - Full order lifecycle management
   - Status workflow: PENDING → CONFIRMED → IN_PRODUCTION → DELIVERED
   - Multiple items per order with individual pricing
   - Delivery date tracking

5. **Ordens de Produção (Production Orders)**
   - Kanban-style board view
   - Link orders to production orders
   - Assign responsible operators
   - Deadline tracking
   - Status: PENDING → IN_PRODUCTION → COMPLETED

6. **Estoque (Stock)**
   - Inventory management with two types: Raw Materials and Finished Products
   - Stock movements tracking (IN/OUT)
   - Low stock alerts
   - Automatic minimum quantity alerts

7. **Usuários (Users)** - Admin Only
   - User management
   - Role assignment
   - Account status control

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Prisma ORM** - Database abstraction
- **SQLite** - Development database (PostgreSQL compatible)
- **bcryptjs** - Password hashing
- **jsonwebtoken (JWT)** - Authentication

## Project Structure

```
ERP_switch/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── middleware/       # Auth and other middleware
│   │   └── routes/           # API routes
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.js           # Database seeding
│   ├── server.js             # Express server entry point
│   ├── .env                  # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API client
│   │   ├── context/          # React context
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

1. **Clone or extract the project**
```bash
cd ERP_switch
```

2. **Setup Backend**
```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
```

### Running the Application

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
```
Server will run on `http://localhost:3001`

**Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
```
Application will run on `http://localhost:5173`

## Default Credentials

After seeding the database, use these credentials to log in:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@erp.com | admin123 |
| Operator | operator@erp.com | admin123 |
| Seller | seller@erp.com | admin123 |

**⚠️ Important:** Change these credentials in production!

## Available Scripts

### Backend
```bash
npm run dev        # Start development server with nodemon
npm start          # Start production server
npm run db:migrate # Run Prisma migrations
npm run db:seed    # Seed the database
npm run db:studio  # Open Prisma Studio
```

### Frontend
```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3001
NODE_ENV=development
```

### Frontend (vite.config.js)
- API proxy is configured to `http://localhost:3001`
- Change this in production

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/users` - Get all users (ADMIN)
- `POST /api/auth/users` - Create user (ADMIN)
- `PUT /api/auth/users/:id` - Update user (ADMIN)
- `DELETE /api/auth/users/:id` - Delete user (ADMIN)

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Customers
- `GET /api/customers` - List customers
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Orders
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/stats` - Get order statistics
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Production Orders
- `GET /api/production-orders` - List production orders
- `GET /api/production-orders/:id` - Get production order details
- `GET /api/production-orders/stats` - Get production statistics
- `POST /api/production-orders` - Create production order
- `PUT /api/production-orders/:id` - Update production order
- `PATCH /api/production-orders/:id/status` - Update production order status
- `DELETE /api/production-orders/:id` - Delete production order

### Stock
- `GET /api/stock` - List stock items
- `GET /api/stock/:id` - Get stock item details
- `GET /api/stock/alerts/low-stock` - Get low stock alerts
- `GET /api/stock/movements` - Get stock movements
- `POST /api/stock` - Create stock item
- `PUT /api/stock/:id` - Update stock item
- `DELETE /api/stock/:id` - Delete stock item
- `POST /api/stock/movements` - Register stock movement

## Role-Based Permissions

### ADMIN
- Full access to all modules
- User management
- Can create, edit, delete all resources

### OPERATOR
- Can manage products and stock
- Can create and update production orders
- Can change order status
- Cannot manage users or access admin settings

### SELLER
- Can create and manage customers
- Can create and edit orders
- Cannot manage products, production, or stock

## Database Schema

### Models
- **User** - System users with roles
- **Product** - T-shirt products with sizes and colors
- **Customer** - Customer information and payment terms
- **Order** - Customer orders with order items
- **OrderItem** - Individual items in an order
- **ProductionOrder** - Production tasks linked to orders
- **StockItem** - Inventory items
- **StockMovement** - Stock movement history

## UI Features

### Dashboard
- Summary cards with key metrics
- Low stock alerts
- Production order summary

### Navigation
- Dark sidebar with role-based menu items
- User info and logout button
- Easy access to all modules

### Data Management
- Search and filter functionality
- CRUD modals for creating/editing records
- Status dropdown selectors
- Confirmation dialogs for deletions

### Status Badges
- Color-coded status indicators
- Visual status workflow representation

## Production Deployment

### Database
1. Create a PostgreSQL database
2. Update `.env` with PostgreSQL connection string
3. Run migrations: `npx prisma migrate deploy`

### Backend
1. Build and deploy Node.js application
2. Set secure `JWT_SECRET` environment variable
3. Use a process manager like PM2

### Frontend
1. Build production bundle: `npm run build`
2. Deploy `dist/` folder to static hosting
3. Configure API endpoint to production backend

## Support & Troubleshooting

### Port already in use
- Backend: Change PORT in .env
- Frontend: Vite will use next available port

### Database migration issues
```bash
npx prisma migrate reset  # Reset database and re-seed
npx prisma db push       # Sync schema with database
```

### JWT authentication errors
- Ensure token is stored in localStorage
- Check JWT_SECRET is the same between sessions
- Tokens expire after 24 hours

## License

This project is provided as-is for t-shirt factory management.

## Contributing

Contributions are welcome! Please ensure code follows the existing style and includes proper error handling.

---

**Version:** 1.0.0
**Last Updated:** 2026-03-11
