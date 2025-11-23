// create-admin-properly.js
import User from './src/models/User.js';
import { sequelize } from './src/config/database.js';

async function createAdminProperly() {
  try {
    await sequelize.sync();
    
    console.log('🚀 Creating admin user...');
    
    const admin = await User.create({
      username: 'admin',
      password: 'temp123', // Должен автоматически захэшироваться
      fullName: 'Администратор Системы',
      role: 'admin'
    });
    
    console.log('✅ Admin created successfully!');
    console.log('Username:', admin.username);
    console.log('Password hash:', admin.password); // Должен быть хэш, а не "temp123"
    console.log('Role:', admin.role);
    console.log('ID:', admin.id);
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

createAdminProperly();