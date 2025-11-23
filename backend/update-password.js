// update-password.js
import User from './models/User.js';
import { sequelize } from './config/database.js';
import bcrypt from 'bcrypt';

async function updateAdminPassword() {
  try {
    await sequelize.sync();
    
    const admin = await User.findOne({ where: { username: 'admin' } });
    
    if (admin) {
      // Хэшируем пароль и обновляем пользователя
      admin.password = 'temp123'; // Пароль автоматически захэшируется через хук
      await admin.save();
      
      console.log('Admin password updated successfully');
      console.log('New hash:', admin.password);
    } else {
      console.log('Admin user not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

updateAdminPassword();