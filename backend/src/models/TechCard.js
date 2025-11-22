import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const TechCard = sequelize.define('TechCard', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // === ОСНОВНАЯ ИНФОРМАЦИЯ О ЗАКАЗЕ ===
  customer: {                    // Заказчик (организация/завод)
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 200]
    }
  },
  orderName: {                  // Наименование заказа (конвейерная линия)
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 200]
    }
  },
  productName: {                // Наименование изделия (ролики, оси, втулки)
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 200]
    }
  },
  productCode: {                // Код изделия (уникальный)
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  
  // === ТИП ОБРАБОТКИ - ЗАЩИТА ОТ ДУРАКА ===
  processingType: {            
    type: DataTypes.ENUM(
      'rough',                 // Черновая (до термообработки)
      'finish',                // Чистовая (после термообработки)  
      'assembly',              // Сборка
      'setup1',                // Установка 1
      'setup2',                // Установка 2
      'other'                  // Другое
    ),
    allowNull: false,
    defaultValue: 'rough'
  },
  
  // === СООБЩЕНИЕ ДЛЯ ОПЕРАТОРА ===
  instructions: {              
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000]  // "ВНИМАНИЕ: Размеры до термообработки!"
    }
  },
  
  // === КОНТРОЛЬ ПОСЛЕДОВАТЕЛЬНОСТИ ===
  requiresPrevious: {          // Требует завершения предыдущей техкарты
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  previousTechCardId: {        // Ссылка на предыдущую техкарту
    type: DataTypes.INTEGER,
    allowNull: true
  },
  
  // === ПРОИЗВОДСТВЕННЫЕ ПАРАМЕТРЫ ===
  totalQuantity: {              // Общее количество
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  currentQuantity: {            // Текущее количество (уменьшается при браке)
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  
  // === ДОКУМЕНТООБОРОТ ===
  documentNumber: {             // Номер документа техкарты
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  pdfPath: {                    // Путь к PDF файлу (если загружен)
    type: DataTypes.STRING,
    allowNull: true
  },
  
  // === ЭТАПЫ ПРОИЗВОДСТВА (простая структура) ===
  stages: {                     // JSON с этапами производства
    type: DataTypes.JSONB,      // [{name: "Отрезная", planned: 150, completed: 0}]
    allowNull: false,
    defaultValue: []
  },
  
  // === СТАТУСЫ ===
  status: {                     // Статус техкарты
    type: DataTypes.ENUM(
      'draft',                  // Черновик
      'in_progress',            // В работе
      'on_hold',                // Приостановлено
      'completed',              // Завершено
      'cancelled'               // Отменено
    ),
    defaultValue: 'draft'
  },
  priority: {                   // Приоритет
    type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
    defaultValue: 'normal'
  },
  
  // === ДАТЫ ===
  deadline: {                   // Крайний срок выполнения
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // === СИСТЕМНЫЕ ПОЛЯ ===
  createdBy: {                  // Кто создал техкарту (связь с User)
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  isActive: {                   // Активна ли техкарта
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'tech_cards',
  timestamps: true,  // createdAt, updatedAt автоматически
  indexes: [
    {
      fields: ['productCode']  // Быстрый поиск по коду изделия
    },
    {
      fields: ['customer']     // Быстрый поиск по заказчику
    },
    {
      fields: ['status']       // Быстрый поиск по статусу
    }
  ]
});

export default TechCard;