import express from 'express';
import { register, login, logout, deleteUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login)
router.post('/signup', register)
router.post('/logout', logout)
router.delete('/user/:id', deleteUser)

export default router;