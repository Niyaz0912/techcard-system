// src/controllers/userController.js
import User from '../models/User.js';

// GET все пользователи
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { isActive: true },
      attributes: { exclude: ['password'] } // не возвращаем пароли
    });
    
    res.json({
      status: "OK",
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR", 
      message: "Ошибка при загрузке пользователей",
      error: error.message
    });
  }
};

// GET одного пользователя
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ 
        status: "ERROR",
        message: "Пользователь не найден" 
      });
    }
    
    res.json({ 
      status: "OK", 
      data: user 
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Ошибка при загрузке пользователя",
      error: error.message
    });
  }
};

// POST создать пользователя
export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    
    // Возвращаем без пароля
    const userWithoutPassword = user.toSafeObject ? user.toSafeObject() : user;
    
    res.json({ 
      status: "OK", 
      data: userWithoutPassword 
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Ошибка при создании пользователя", 
      error: error.message
    });
  }
};

// PUT обновить пользователя
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        status: "ERROR",
        message: "Пользователь не найден" 
      });
    }
    
    await user.update(req.body);
    
    const userWithoutPassword = user.toSafeObject ? user.toSafeObject() : user;
    
    res.json({ 
      status: "OK", 
      data: userWithoutPassword 
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Ошибка при обновлении пользователя",
      error: error.message
    });
  }
};

// DELETE удалить пользователя
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        status: "ERROR",
        message: "Пользователь не найден" 
      });
    }
    
    await user.update({ isActive: false });
    
    res.json({ 
      status: "OK", 
      message: "Пользователь удален" 
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Ошибка при удалении пользователя",
      error: error.message
    });
  }
};