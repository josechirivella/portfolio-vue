import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from '../database/schema'
import { existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'

let db: ReturnType<typeof drizzle> | null = null

export function getDatabase() {
  if (!db) {
    const dbPath = './data/portfolio.db'
    
    // Ensure the data directory exists
    const dbDir = dirname(dbPath)
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true })
    }

    // Create SQLite connection
    const sqlite = new Database(dbPath)
    
    // Enable foreign keys and WAL mode for better performance
    sqlite.pragma('foreign_keys = ON')
    sqlite.pragma('journal_mode = WAL')
    
    db = drizzle(sqlite, { schema })
  }

  return db
}

export function closeDatabase() {
  if (db) {
    // SQLite connections are automatically closed when the process exits
    db = null
  }
}