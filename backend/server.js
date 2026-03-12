import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './src/routes/auth.js';
import productRoutes from './src/routes/products.js';
import customerRoutes from './src/routes/customers.js';
import orderRoutes from './src/routes/orders.js';
import productionOrderRoutes from './src/routes/productionOrders.js';
import stockRoutes from './src/routes/stock.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/production-orders', productionOrderRoutes);
app.use('/api/stock', stockRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`ERP_switch backend server running on port ${PORT}`);
});
