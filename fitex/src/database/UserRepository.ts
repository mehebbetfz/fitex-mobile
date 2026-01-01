import { database } from './DatabaseService';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  google_id?: string;
  subscription_status: 'free' | 'premium' | 'trial';
  subscription_expiry?: string;
  created_at: string;
  updated_at: string;
  sync_status: string;
  last_synced?: string;
}

export class UserRepository {
  private static instance: UserRepository;

  static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  async createOrUpdateUser(userData: Partial<User>): Promise<string> {
    let user: User | null = null;

    // Ищем пользователя по google_id или email
    if (userData.google_id) {
      user = await this.findByGoogleId(userData.google_id);
    }
    
    if (!user && userData.email) {
      user = await this.findByEmail(userData.email);
    }

    const now = new Date().toISOString();
    
    if (user) {
      // Обновляем существующего пользователя
      await database.update('users', user.id, {
        ...userData,
        updated_at: now,
        sync_status: 'pending',
      });
      return user.id;
    } else {
      // Создаем нового пользователя
      const id = uuidv4();
      const newUser: User = {
        id,
        email: userData.email!,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        avatar: userData.avatar,
        google_id: userData.google_id,
        subscription_status: userData.subscription_status || 'free',
        subscription_expiry: userData.subscription_expiry,
        created_at: now,
        updated_at: now,
        sync_status: 'pending',
      };

      return await database.insert('users', newUser);
    }
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const sql = `SELECT * FROM users WHERE google_id = ? LIMIT 1`;
    const [user] = await database.query(sql, [googleId]);
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;
    const [user] = await database.query(sql, [email]);
    return user || null;
  }

  async getUserById(id: string): Promise<User | null> {
    return await database.getById('users', id);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    await database.update('users', id, {
      ...updates,
      sync_status: 'pending',
    });
  }

  async updateSubscription(
    userId: string,
    status: 'free' | 'premium' | 'trial',
    expiry?: string
  ): Promise<void> {
    await this.updateUser(userId, {
      subscription_status: status,
      subscription_expiry: expiry,
    });
  }

  async isUserSubscribed(userId: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) return false;

    if (user.subscription_status === 'premium') {
      if (user.subscription_expiry) {
        return new Date(user.subscription_expiry) > new Date();
      }
      return true;
    }

    return false;
  }

  async getUsersPendingSync(): Promise<User[]> {
    return await database.getAll('users', 'sync_status = ?', ['pending']);
  }
}

export const userRepository = UserRepository.getInstance();