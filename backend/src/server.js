import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import connectDB, { sequelize } from './config/database.js';

// Импорты моделей ДО их использования
import User from './models/User.js';
import TechCard from './models/TechCard.js';

// Загрузка переменных окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Функция инициализации базы данных
const initializeDB = async () => {
  try {
    // Подключаемся к БД
    await connectDB();
    
    // Синхронизируем модели с БД
    await sequelize.sync({ alter: true });
    console.log('✅ All models were synchronized successfully.');
    
    // Проверяем созданные таблицы
    const tables = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📊 Database tables:', tables[0].map(t => t.table_name));
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Инициализируем БД перед запуском сервера
await initializeDB();

// ==================== ROUTES ====================

// Корневой эндпоинт
app.get("/", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "🏭 TechCard System API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    database: "PostgreSQL"
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "TechCard Backend is running!",
    timestamp: new Date().toISOString()
  });
});

// ==================== TECH CARDS API ====================

// GET все техкарты
app.get("/api/tech-cards", async (req, res) => {
  try {
    const techCards = await TechCard.findAll({
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'fullName']
      }]
    });
    
    res.json({
      status: "OK",
      data: techCards,
      count: techCards.length
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch tech cards",
      error: error.message
    });
  }
});

// GET конкретную техкарту
app.get("/api/tech-cards/:id", async (req, res) => {
  try {
    const techCard = await TechCard.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'fullName']
      }]
    });
    
    if (!techCard) {
      return res.status(404).json({ 
        status: "ERROR",
        message: "Tech card not found" 
      });
    }
    
    res.json({ 
      status: "OK", 
      data: techCard 
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch tech card",
      error: error.message
    });
  }
});

// POST создать техкарту
app.post("/api/tech-cards", async (req, res) => {
  try {
    const techCard = await TechCard.create({
      ...req.body,
      createdBy: 1 // Временное значение, потом будем брать из авторизации
    });
    
    res.json({ 
      status: "OK", 
      data: techCard 
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Failed to create tech card",
      error: error.message
    });
  }
});

// PUT обновить техкарту
app.put("/api/tech-cards/:id", async (req, res) => {
  try {
    const techCard = await TechCard.findByPk(req.params.id);
    
    if (!techCard) {
      return res.status(404).json({ 
        status: "ERROR",
        message: "Tech card not found" 
      });
    }
    
    await techCard.update(req.body);
    
    res.json({ 
      status: "OK", 
      data: techCard 
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Failed to update tech card",
      error: error.message
    });
  }
});

// DELETE удалить техкарту
app.delete("/api/tech-cards/:id", async (req, res) => {
  try {
    const techCard = await TechCard.findByPk(req.params.id);
    
    if (!techCard) {
      return res.status(404).json({ 
        status: "ERROR",
        message: "Tech card not found" 
      });
    }
    
    await techCard.destroy();
    
    res.json({ 
      status: "OK", 
      message: "Tech card deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Failed to delete tech card",
      error: error.message
    });
  }
});

// ==================== USERS API ====================

// GET все пользователи
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Не возвращаем пароль
    });
    
    res.json({
      status: "OK",
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch users",
      error: error.message
    });
  }
});

// POST создать пользователя
app.post("/api/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    
    // Не возвращаем пароль в ответе
    const userResponse = { ...user.toJSON() };
    delete userResponse.password;
    
    res.json({ 
      status: "OK", 
      data: userResponse 
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Failed to create user",
      error: error.message
    });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗃️ Database: PostgreSQL`);
  console.log(`📊 API endpoints available:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/tech-cards`);
  console.log(`   POST /api/tech-cards`);
  console.log(`   GET  /api/tech-cards/:id`);
  console.log(`   PUT  /api/tech-cards/:id`);
  console.log(`   DEL  /api/tech-cards/:id`);
  console.log(`   GET  /api/users`);
});