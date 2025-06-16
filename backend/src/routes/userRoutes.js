import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';
const router = express.Router();

// Admin routes
router.get('/admin', verifyToken, authorizeRoles("admin"), (req, res) => {
    res.json({message: "Welcome, Admin!"})
});

// Public routes
router.get('/user', (req, res) => {
    res.json({message: "Welcome, User"})
});

export default router;