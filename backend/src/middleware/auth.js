import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware проверки JWT токена
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }

    // Проверяем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 🔥 ВАЖНО: Получаем пользователя из БД (не доверяем токену)
    const user = await User.findByPk(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Пользователь не найден или заблокирован'
      });
    }

    // Сохраняем пользователя в запросе
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Неверный или просроченный токен'
    });
  }
};

// Middleware проверки ролей (проверяем в БД!)
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // 🔥 ВАЖНО: Роль берем из пользователя в БД, а не из токена!
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Недостаточно прав'
      });
    }
    next();
  };
};