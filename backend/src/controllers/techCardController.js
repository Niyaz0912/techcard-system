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
  try {
    const techCardData = {
      ...req.body,
      createdBy: req.user.id, // Берем ID из middleware аутентификации
      currentQuantity: req.body.totalQuantity // Автоматически выставляем остаток
    };

    const techCard = await TechCard.create(techCardData);
    
    res.json({ 
      status: "OK", 
      data: techCard 
    });
  } catch (error) {
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