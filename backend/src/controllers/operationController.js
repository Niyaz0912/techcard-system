// src/controllers/operationController.js
import Operation from '../models/Operation.js';
import TechCard from '../models/TechCard.js';

// GET все операции по техкарте
export const getOperationsByTechCard = async (req, res) => {
  try {
    const operations = await Operation.findAll({
      where: { 
        techCardId: req.params.techCardId,
        isActive: true 
      },
      order: [['date', 'DESC']]
    });
    
    res.json({ 
      status: "OK", 
      data: operations 
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Ошибка при загрузке операций",
      error: error.message
    });
  }
};

// POST создать операцию
export const createOperation = async (req, res) => {
  try {
    const operation = await Operation.create(req.body);
    
    // Обновляем currentQuantity в техкарте если принято ОТК
    if (req.body.otcStatus === 'принято') {
      const techCard = await TechCard.findByPk(req.body.techCardId);
      if (techCard) {
        const newQuantity = techCard.currentQuantity - req.body.quantity;
        await techCard.update({ 
          currentQuantity: Math.max(0, newQuantity),
          status: newQuantity <= 0 ? 'completed' : 'in_progress'
        });
      }
    }
    
    res.json({ 
      status: "OK", 
      data: operation 
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Ошибка при создании операции",
      error: error.message
    });
  }
};

// PUT обновить операцию
export const updateOperation = async (req, res) => {
  try {
    const operation = await Operation.findByPk(req.params.id);
    
    if (!operation) {
      return res.status(404).json({ 
        status: "ERROR",
        message: "Операция не найдена" 
      });
    }
    
    await operation.update(req.body);
    
    res.json({ 
      status: "OK", 
      data: operation 
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Ошибка при обновлении операции",
      error: error.message
    });
  }
};

// DELETE удалить операцию
export const deleteOperation = async (req, res) => {
  try {
    const operation = await Operation.findByPk(req.params.id);
    
    if (!operation) {
      return res.status(404).json({ 
        status: "ERROR",
        message: "Операция не найдена" 
      });
    }
    
    await operation.update({ isActive: false });
    
    res.json({ 
      status: "OK", 
      message: "Операция удалена" 
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Ошибка при удалении операции",
      error: error.message
    });
  }
};