import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const TechCard = sequelize.define('TechCard', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // === ОСНОВНАЯ ИНФОРМАЦИЯ ===
  customer: {                    // Заказчик
    type: DataTypes.STRING,
    allowNull: false
  },
  orderName: {                  // Наименование заказа
    type: DataTypes.STRING,
    allowNull: false
  },
  productName: {                // Наименование изделия
    type: DataTypes.STRING,
    allowNull: false
  },
  productCode: {                // Код изделия
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  
  // === ПРОИЗВОДСТВО ===
  totalQuantity: {              // Общее количество
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  currentQuantity: {            // Текущий остаток
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 }
  },
  
  // === ДОКУМЕНТАЦИЯ ===
  documentNumber: {             // Номер техкарты
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  pdfPath: {                    // Путь к PDF файлу
    type: DataTypes.STRING,
    allowNull: true
  },
  
  // === СТАТУС ===
  status: {                     // Статус выполнения
    type: DataTypes.ENUM('draft', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'draft'
  },
  
  // === ДАТЫ ===
  deadline: {                   // Крайний срок
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // === СИСТЕМНЫЕ ===
  createdBy: {                  // Кто создал
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isActive: {                   // Активна
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'tech_cards',
  timestamps: true
});

export default TechCard;