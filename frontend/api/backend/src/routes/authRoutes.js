import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { register, login, logout, fetchUser } from '../controllers/authController.js';

const router = express.Router();

router.get('/me', authMiddleware, fetchUser)
router.post('/login', login)
router.post('/signup', register)
router.post('/logout', logout)

export default router;