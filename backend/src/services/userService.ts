import bcrypt from 'bcrypt';
import { getDatabase } from '../database/connection';
import { User, CreateUserInput, UserProfile } from '../types';

export class UserService {
  private db = getDatabase();

  async createUser(input: CreateUserInput): Promise<UserProfile> {
    const hashedPassword = await bcrypt.hash(input.password, 12);
    
    const stmt = this.db.prepare(`
      INSERT INTO users (email, password_hash, name, is_admin) 
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      input.email,
      hashedPassword,
      input.name || null,
      input.is_admin ? 1 : 0
    );

    const user = await this.getUserById(result.lastInsertRowid as number);
    if (!user) {
      throw new Error('Failed to create user');
    }

    return user;
  }

  async getUserById(id: number): Promise<UserProfile | null> {
    const stmt = this.db.prepare(`
      SELECT id, email, name, is_admin, theme_preference, created_at 
      FROM users 
      WHERE id = ? AND is_active = 1
    `);
    
    const user = stmt.get(id) as UserProfile | undefined;
    return user || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const stmt = this.db.prepare(`
      SELECT * FROM users WHERE email = ? AND is_active = 1
    `);
    
    const user = stmt.get(email) as User | undefined;
    return user || null;
  }

  async validatePassword(email: string, password: string): Promise<UserProfile | null> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      is_admin: user.is_admin,
      theme_preference: user.theme_preference,
      created_at: user.created_at
    };
  }

  async updateUserProfile(id: number, updates: Partial<Pick<User, 'name' | 'theme_preference'>>): Promise<UserProfile | null> {
    const setParts: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      setParts.push('name = ?');
      values.push(updates.name);
    }

    if (updates.theme_preference !== undefined) {
      setParts.push('theme_preference = ?');
      values.push(updates.theme_preference);
    }

    if (setParts.length === 0) {
      return this.getUserById(id);
    }

    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE users 
      SET ${setParts.join(', ')} 
      WHERE id = ? AND is_active = 1
    `);

    stmt.run(...values);
    return this.getUserById(id);
  }

  async updatePassword(id: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    const stmt = this.db.prepare(`
      UPDATE users 
      SET password_hash = ? 
      WHERE id = ? AND is_active = 1
    `);
    
    stmt.run(hashedPassword, id);
  }

  async getAllUsers(includeInactive = false): Promise<UserProfile[]> {
    const whereClause = includeInactive ? '' : 'WHERE is_active = 1';
    
    const stmt = this.db.prepare(`
      SELECT id, email, name, is_admin, theme_preference, created_at 
      FROM users 
      ${whereClause}
      ORDER BY created_at DESC
    `);
    
    return stmt.all() as UserProfile[];
  }

  async toggleUserActive(id: number): Promise<boolean> {
    const stmt = this.db.prepare(`
      UPDATE users 
      SET is_active = NOT is_active 
      WHERE id = ?
    `);
    
    const result = stmt.run(id);
    return result.changes > 0;
  }

  async deleteUser(id: number): Promise<boolean> {
    // Soft delete by marking inactive
    const stmt = this.db.prepare(`
      UPDATE users 
      SET is_active = 0 
      WHERE id = ?
    `);
    
    const result = stmt.run(id);
    return result.changes > 0;
  }

  async emailExists(email: string): Promise<boolean> {
    const stmt = this.db.prepare(`
      SELECT 1 FROM users WHERE email = ?
    `);
    
    return !!stmt.get(email);
  }
}
