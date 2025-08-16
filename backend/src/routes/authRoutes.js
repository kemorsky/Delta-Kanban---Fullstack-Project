import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { register, login, logout, deleteUser, fetchUser } from '../controllers/authController.js';

const router = express.Router();

router.get('/api/auth/me', authMiddleware, fetchUser)
router.post('/api/auth/login', login)
router.post('/api/auth/signup', register)
router.post('/api/auth/logout', logout)
router.delete('/api/auth/user/:id', deleteUser)

export default router;