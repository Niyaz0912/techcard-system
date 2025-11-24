import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import connectDB, { sequelize } from './config/database.js';

// Импорты роутов
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import techCardsRoutes from './routes/techCards.js';
import operationRoutes from './routes/operations.js';

// Импорты моделей
import User from './models/User.js';
import TechCard from './models/TechCard.js';
import Operation from './models/Operation.js';
import './models/associations.js';

// Загрузка переменных окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Инициализация базы данных
const initializeDB = async () => {
  try {
    await connectDB();
    
    // СИНХРОНИЗАЦИЯ БАЗЫ ДАННЫХ
    await sequelize.sync({ force: false });
    console.log('✅ База данных готова!');
    
    // Проверка таблиц (для PostgreSQL)
    try {
      const tables = await sequelize.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      console.log('📊 Таблицы в базе:', tables[0].map(t => t.table_name));
    } catch (error) {
      console.log('📊 База данных синхронизирована (SQLite)');
    }
    
  } catch (error) {
    console.error('❌ Ошибка базы данных:', error);
    process.exit(1);
  }
};

// Создание тестового пользователя
const createTestUser = async () => {
  try {
    const userCount = await User.count();
    
    if (userCount === 0) {
      await User.create({
        username: 'admin',
        password: 'temp123',
        fullName: 'Администратор Системы',
        role: 'admin'
      });
      console.log('👤 Создан тестовый пользователь: admin');
    }
  } catch (error) {
    console.log('⚠️ Пользователь уже существует');
  }
};

// Инициализируем БД
await initializeDB();
await createTestUser();

// ==================== МАРШРУТЫ ====================

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tech-cards', techCardsRoutes);
app.use('/api/operations', operationRoutes);

// Корневой эндпоинт
app.get("/", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "🏭 Система Техкарт API",
    version: "1.0.0"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Сервер работает!",
    timestamp: new Date().toISOString()
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
  console.log(`📋 Окружение: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Доступные эндпоинты:`);
  console.log(`   GET  /api/health`);
  console.log(`   POST /api/auth/login`);
  console.log(`   GET  /api/auth/me`);
  console.log(`   GET  /api/users`);
  console.log(`   POST /api/users`);
  console.log(`   GET  /api/tech-cards`);
  console.log(`   POST /api/tech-cards`);
  console.log(`   GET  /api/operations/tech-card/:id`);
  console.log(`   POST /api/operations`);
});