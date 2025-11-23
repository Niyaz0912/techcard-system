import User from './User.js';
import TechCard from './TechCard.js';
import Operation from './Operation.js'; // ← ДОБАВЬ ЭТУ СТРОКУ

// Ассоциации пользователей и техкарт
User.hasMany(TechCard, { foreignKey: 'createdBy' });
TechCard.belongsTo(User, { foreignKey: 'createdBy' });

// Ассоциации техкарт и операций
TechCard.hasMany(Operation, { foreignKey: 'techCardId' });
Operation.belongsTo(TechCard, { foreignKey: 'techCardId' });

console.log('✅ Model associations established');