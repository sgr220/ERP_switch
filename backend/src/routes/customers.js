import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAllCustomers);
router.get('/:id', authenticateToken, getCustomerById);
router.post('/', authenticateToken, authorizeRole('ADMIN', 'SELLER'), createCustomer);
router.put('/:id', authenticateToken, authorizeRole('ADMIN', 'SELLER'), updateCustomer);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), deleteCustomer);

export default router;
