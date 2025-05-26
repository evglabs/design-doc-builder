import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { Environment } from '../types';

let db: Database.Database | null = null;

export function initializeDatabase(env: Environment): Database.Database {
  if (db) {
    return db;
  }

  // Ensure database directory exists
  const dbDir = path.dirname(env.DATABASE_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Initialize database connection
  db = new Database(env.DATABASE_PATH);
  
  // Enable foreign key constraints
  db.pragma('foreign_keys = ON');
  
  // Set WAL mode for better concurrency
  db.pragma('journal_mode = WAL');
  
  // Run migrations
  runMigrations(db);
  
  return db;
}

function runMigrations(database: Database.Database): void {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  const transaction = database.transaction(() => {
    try {
      // Execute the entire schema as one block to handle multi-line statements properly
      database.exec(schema);
    } catch (error) {
      console.error('Error executing schema:', error);
      throw error;
    }
  });
  
  transaction();
  
  console.log('Database migrations completed successfully');
}

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDatabase();
  process.exit(0);
});
