// src/controllers/techCardController.js
import TechCard from '../models/TechCard.js';

// GET все техкарты
export const getAllTechCards = async (req, res) => {
  try {
    const techCards = await TechCard.findAll({
      where: { isActive: true }
    });
    
    res.json({
      status: "OK",
      data: techCards,
      count: techCards.length
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR", 
      message: "Ошибка при загрузке техкарт",
      error: error.message
    });
  }
};

// GET одну техкарту
export const getTechCardById = async (req, res) => {
  try {
    const techCard = await TechCard.findByPk(req.params.id);
    
    if (!techCard) {
      return res.status(404).json({ 
        status: "ERROR",
        message: "Техкарта не найдена" 
      });
    }
    
    res.json({ 
      status: "OK", 
      data: techCard 
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Ошибка при загрузке техкарты",
      error: error.message
    });
  }
};


// POST создать техкарту
export const createTechCard = async (req, res) => {
  console.log('🔧 [CREATE_TECHCARD] Начало создания техкарты');
  console.log('📦 [CREATE_TECHCARD] Данные из запроса:', req.body);
  console.log('👤 [CREATE_TECHCARD] Пользователь из запроса:', req.user);
  
  try {
    const techCardData = {
      ...req.body,
      createdBy: req.user.id, // Берем ID из middleware аутентификации
      currentQuantity: req.body.totalQuantity // Автоматически выставляем остаток
    };

    console.log('🛠️ [CREATE_TECHCARD] Данные для создания:', techCardData);

    const techCard = await TechCard.create(techCardData);
    
    console.log('✅ [CREATE_TECHCARD] Техкарта создана успешно:', techCard.id);
    
    res.json({ 
      status: "OK", 
      data: techCard 
    });
  } catch (error) {
    console.error('❌ [CREATE_TECHCARD] Ошибка создания техкарты:');
    console.error('📝 [CREATE_TECHCARD] Сообщение ошибки:', error.message);
    console.error('🔍 [CREATE_TECHCARD] Stack trace:', error.stack);
    
    // Обработка ошибок уникальности
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        status: "ERROR",
        message: "Техкарта с таким кодом изделия или номером документа уже существует",
        error: error.message
      });
    }
    
    // Обработка ошибок валидации
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        status: "ERROR", 
        message: "Ошибка валидации данных",
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      status: "ERROR",
      message: "Ошибка при создании техкарты", 
      error: error.message
    });
  }
};

// PUT обновить техкарту
export const updateTechCard = async (req, res) => {
  try {
    const techCard = await TechCard.findByPk(req.params.id);
    
    if (!techCard) {
      return res.status(404).json({ 
        status: "ERROR",
        message: "Техкарта не найдена" 
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
      message: "Ошибка при обновлении техкарты",
      error: error.message
    });
  }
};

// DELETE удалить техкарту
export const deleteTechCard = async (req, res) => {
  try {
    const techCard = await TechCard.findByPk(req.params.id);
    
    if (!techCard) {
      return res.status(404).json({ 
        status: "ERROR",
        message: "Техкарта не найдена" 
      });
    }
    
    await techCard.update({ isActive: false });
    
    res.json({ 
      status: "OK", 
      message: "Техкарта удалена" 
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Ошибка при удалении техкарты",
      error: error.message
    });
  }
};