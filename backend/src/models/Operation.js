import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Operation = sequelize.define('Operation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  techCardId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  operator: {
    type: DataTypes.STRING,
    allowNull: false
  },
  operation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  
  otcStatus: {
    type: DataTypes.ENUM('принято', 'доработка', 'в процессе'),
    defaultValue: 'в процессе'
  },
  otcNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'operations',
  timestamps: true
});

export default Operation;