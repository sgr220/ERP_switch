import express from 'express';
import {
  getAllStockItems,
  getStockItemById,
  createStockItem,
  updateStockItem,
  deleteStockItem,
  addStockMovement,
  getStockMovements,
  getLowStockAlerts,
} from '../controllers/stockController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/alerts/low-stock', authenticateToken, getLowStockAlerts);
router.get('/movements', authenticateToken, getStockMovements);
router.get('/', authenticateToken, getAllStockItems);
router.get('/:id', authenticateToken, getStockItemById);
router.post('/', authenticateToken, authorizeRole('ADMIN', 'OPERATOR'), createStockItem);
router.put('/:id', authenticateToken, authorizeRole('ADMIN', 'OPERATOR'), updateStockItem);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), deleteStockItem);
router.post('/movements', authenticateToken, authorizeRole('ADMIN', 'OPERATOR'), addStockMovement);

export default router;
