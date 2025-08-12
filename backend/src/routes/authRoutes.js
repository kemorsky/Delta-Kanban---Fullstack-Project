import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { register, login, logout, deleteUser, fetchUser } from '../controllers/authController.js';

const router = express.Router();

router.get('/me', authMiddleware, fetchUser)
router.post('/login', login)
router.post('/signup', register)
router.post('/logout', logout)
router.delete('/user/:id', deleteUser)

export default router;