import express from 'express';
import {
  login,
  getCurrentUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
} from '../controllers/authController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticateToken, getCurrentUser);
router.post('/change-password', authenticateToken, changePassword);

// Admin only routes
router.get('/users', authenticateToken, authorizeRole('ADMIN'), getAllUsers);
router.post('/users', authenticateToken, authorizeRole('ADMIN'), createUser);
router.put('/users/:id', authenticateToken, authorizeRole('ADMIN'), updateUser);
router.delete('/users/:id', authenticateToken, authorizeRole('ADMIN'), deleteUser);

export default router;
