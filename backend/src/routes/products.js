import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAllProducts);
router.get('/:id', authenticateToken, getProductById);
router.post('/', authenticateToken, authorizeRole('ADMIN', 'OPERATOR'), createProduct);
router.put('/:id', authenticateToken, authorizeRole('ADMIN', 'OPERATOR'), updateProduct);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN', 'OPERATOR'), deleteProduct);

export default router;
