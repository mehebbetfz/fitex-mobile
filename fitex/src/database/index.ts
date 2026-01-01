import { database } from './DatabaseService'
export { workoutRepository } from './WorkoutRepository';
export { userRepository, type User } from './UserRepository';
export { progressRepository } from './ProgressRepository';

// Инициализация базы данных
export const initDatabase = async () => {
  try {
    await database.init();
    console.log('📦 Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    return false;
  }
};