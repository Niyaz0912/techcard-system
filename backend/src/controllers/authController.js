import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Генерация токенов
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Вход в систему
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Находим пользователя
    const user = await User.findOne({ where: { username } });
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Неверный логин или пароль'
      });
    }

    // 2. Проверяем пароль
    const isPasswordValid = await user.correctPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Неверный логин или пароль'
      });
    }

    // 3. Создаем JWT токен
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Вход выполнен успешно',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при входе в систему',
      error: error.message
    });
  }
};

// Получение текущего пользователя
export const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.toSafeObject()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении данных пользователя',
      error: error.message
    });
  }
};

// Обновление access token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token обязателен'
      });
    }

    // Проверяем refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    if (decoded.type !== 'refresh') {
      return res.status(403).json({
        success: false,
        message: 'Неверный тип токена'
      });
    }

    // 🔥 ВАЖНО: Проверяем пользователя в БД
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    // Генерируем новые токены
    const tokens = generateTokens(user.id);

    res.json({
      success: true,
      data: { tokens }
    });

  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Неверный refresh token',
      error: error.message
    });
  }
};

// Выход из системы
export const logout = async (req, res) => {
  try {
    // В будущем можно добавить blacklist токенов
    res.json({
      success: true,
      message: 'Успешный выход из системы'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при выходе из системы',
      error: error.message
    });
  }
};