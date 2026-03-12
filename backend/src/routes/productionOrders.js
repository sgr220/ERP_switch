import express from 'express';
import {
  getAllProductionOrders,
  getProductionOrderById,
  createProductionOrder,
  updateProductionOrder,
  updateProductionOrderStatus,
  deleteProductionOrder,
  getProductionOrderStats,
} from '../controllers/productionOrderController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authenticateToken, getProductionOrderStats);
router.get('/', authenticateToken, getAllProductionOrders);
router.get('/:id', authenticateToken, getProductionOrderById);
router.post('/', authenticateToken, authorizeRole('ADMIN', 'OPERATOR'), createProductionOrder);
router.put('/:id', authenticateToken, authorizeRole('ADMIN', 'OPERATOR'), updateProductionOrder);
router.patch('/:id/status', authenticateToken, authorizeRole('ADMIN', 'OPERATOR'), updateProductionOrderStatus);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), deleteProductionOrder);

export default router;
