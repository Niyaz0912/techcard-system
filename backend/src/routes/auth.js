import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, getMe, refreshToken, logout } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 🔒 Лимит запросов для авторизации (защита от brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // максимум 5 попыток
  message: {
    success: false,
    message: 'Слишком много попыток входа. Попробуйте позже.'
  }
});

// 📍 Public routes
router.post('/login', authLimiter, login);
router.post('/refresh-token', refreshToken);

// 📍 Protected routes
router.get('/me', authenticateToken, getMe);
router.post('/logout', authenticateToken, logout);

export default router;