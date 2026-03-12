import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
} from '../controllers/orderController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authenticateToken, getOrderStats);
router.get('/', authenticateToken, getAllOrders);
router.get('/:id', authenticateToken, getOrderById);
router.post('/', authenticateToken, authorizeRole('ADMIN', 'SELLER'), createOrder);
router.put('/:id', authenticateToken, authorizeRole('ADMIN', 'SELLER'), updateOrder);
router.patch('/:id/status', authenticateToken, authorizeRole('ADMIN', 'OPERATOR'), updateOrderStatus);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), deleteOrder);

export default router;
