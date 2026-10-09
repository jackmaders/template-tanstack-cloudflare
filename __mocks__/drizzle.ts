import Database from "better-sqlite3";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { postRelations } from "../src/shared/db";

export interface MockDatabaseSession {
	close: () => void;
	db: ReturnType<typeof drizzle<typeof postRelations>>;
	sqlite: InstanceType<typeof Database>;
}

/**
 * Creates an isolated in-memory SQLite database instance wrapped with Drizzle ORM
 * for fast and deterministic unit and integration tests.
 * Initializes all tables defined in the schema (auth and posts).
 */
export function createMockDatabase(): MockDatabaseSession {
	const sqlite = new Database(":memory:");
	const db = drizzle({ client: sqlite, relations: postRelations });

	// Initialize tables using drizzle db.run
	db.run(sql`
		CREATE TABLE IF NOT EXISTS user (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE,
			email_verified INTEGER DEFAULT 0 NOT NULL,
			image TEXT,
			role TEXT DEFAULT 'user' NOT NULL,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL
		)
	`);

	db.run(sql`
		CREATE TABLE IF NOT EXISTS session (
			id TEXT PRIMARY KEY,
			expires_at INTEGER NOT NULL,
			token TEXT NOT NULL UNIQUE,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL,
			ip_address TEXT,
			user_agent TEXT,
			user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
		)
	`);

	db.run(sql`
		CREATE TABLE IF NOT EXISTS account (
			id TEXT PRIMARY KEY,
			account_id TEXT NOT NULL,
			provider_id TEXT NOT NULL,
			user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
			access_token TEXT,
			refresh_token TEXT,
			id_token TEXT,
			access_token_expires_at INTEGER,
			refresh_token_expires_at INTEGER,
			scope TEXT,
			password TEXT,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL
		)
	`);

	db.run(sql`
		CREATE TABLE IF NOT EXISTS verification (
			id TEXT PRIMARY KEY,
			identifier TEXT NOT NULL,
			value TEXT NOT NULL,
			expires_at INTEGER NOT NULL,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL
		)
	`);

	db.run(sql`
		CREATE TABLE IF NOT EXISTS rate_limit (
			id TEXT PRIMARY KEY,
			key TEXT NOT NULL UNIQUE,
			count INTEGER NOT NULL,
			last_request INTEGER NOT NULL
		)
	`);

	db.run(sql`
		CREATE TABLE IF NOT EXISTS posts (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			author_id TEXT REFERENCES user(id) ON DELETE CASCADE,
			created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer))
		)
	`);

	return {
		db,
		sqlite,
		close: () => {
			sqlite.close();
		},
	};
}
