// biome-ignore-all lint/security/noSecrets: Test migration strings contain simulated SQL schemas.
// biome-ignore-all lint/style/useNamingConvention: Cloudflare bindings and schema migration names match external schema.

import type { D1Migration } from "@cloudflare/vitest-pool-workers";
import { drizzle } from "drizzle-orm/d1";
import { Miniflare } from "miniflare";
import { postRelations } from "@/shared/db";

export interface D1TestSession {
	clearTables: () => Promise<void>;
	close: () => Promise<void>;
	d1: D1Database;
	db: ReturnType<typeof drizzle<typeof postRelations>>;
}

export const drizzleMigrations: D1Migration[] = [
	{
		name: "20261006145121_famous_robbie_robertson",
		queries: [
			"CREATE TABLE `account` (\n\t`id` text PRIMARY KEY,\n\t`account_id` text NOT NULL,\n\t`provider_id` text NOT NULL,\n\t`user_id` text NOT NULL,\n\t`access_token` text,\n\t`refresh_token` text,\n\t`id_token` text,\n\t`access_token_expires_at` integer,\n\t`refresh_token_expires_at` integer,\n\t`scope` text,\n\t`password` text,\n\t`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,\n\t`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,\n\tCONSTRAINT `fk_account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE\n)",
			"CREATE TABLE `session` (\n\t`id` text PRIMARY KEY,\n\t`expires_at` integer NOT NULL,\n\t`token` text NOT NULL UNIQUE,\n\t`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,\n\t`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,\n\t`ip_address` text,\n\t`user_agent` text,\n\t`user_id` text NOT NULL,\n\tCONSTRAINT `fk_session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE\n)",
			"CREATE TABLE `user` (\n\t`id` text PRIMARY KEY,\n\t`name` text NOT NULL,\n\t`email` text NOT NULL UNIQUE,\n\t`email_verified` integer DEFAULT false NOT NULL,\n\t`image` text,\n\t`role` text DEFAULT 'user' NOT NULL,\n\t`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,\n\t`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL\n)",
			"CREATE TABLE `verification` (\n\t`id` text PRIMARY KEY,\n\t`identifier` text NOT NULL,\n\t`value` text NOT NULL,\n\t`expires_at` integer NOT NULL,\n\t`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,\n\t`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL\n)",
			"CREATE TABLE `posts` (\n\t`id` integer PRIMARY KEY AUTOINCREMENT,\n\t`name` text NOT NULL\n)",
			"CREATE INDEX `account_userId_idx` ON `account` (`user_id`)",
			"CREATE INDEX `session_userId_idx` ON `session` (`user_id`)",
			"CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`)",
		],
	},
	{
		name: "20261006151641_spotty_rafael_vega",
		queries: [
			"ALTER TABLE `posts` ADD `created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL;",
		],
	},
	{
		name: "20261006165509_yellow_anthem",
		queries: [
			"CREATE TABLE `rate_limit` (\n\t`id` text PRIMARY KEY,\n\t`key` text NOT NULL UNIQUE,\n\t`count` integer NOT NULL,\n\t`last_request` integer NOT NULL\n);\n",
		],
	},
	{
		name: "20261008172018_last_micromax",
		queries: [
			"ALTER TABLE `posts` ADD `author_id` text REFERENCES user(id) ON DELETE CASCADE;",
		],
	},
];

/**
 * Applies all unapplied migrations to the D1Database instance.
 * Mirrors the behavior of Cloudflare's `applyD1Migrations` from `@cloudflare/vitest-pool-workers`.
 */
export async function applyD1Migrations(
	db: D1Database,
	migrations: D1Migration[],
	migrationsTableName = "d1_migrations",
): Promise<void> {
	const escapedTableName = `"${migrationsTableName.replaceAll('"', '""')}"`;
	const schema = `CREATE TABLE IF NOT EXISTS ${escapedTableName} (
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
	);`;
	await db.prepare(schema).run();
	const appliedMigrationNames = (
		await db.prepare(`SELECT name FROM ${escapedTableName};`).all()
	).results.map(({ name }) => name);

	const insertMigrationStmt = db.prepare(
		`INSERT INTO ${escapedTableName} (name) VALUES (?);`,
	);
	// Migrations must be executed sequentially to ensure deterministic schema history.
	for (const migration of migrations) {
		if (appliedMigrationNames.includes(migration.name)) {
			continue;
		}
		const queries = migration.queries.map((query) => db.prepare(query));
		queries.push(insertMigrationStmt.bind(migration.name));
		// biome-ignore lint/performance/noAwaitInLoops: Database migrations must be applied sequentially
		await db.batch(queries);
	}
}

/**
 * Creates an isolated D1 Miniflare instance with migrations applied for database and server function tests.
 */
export async function createTestDatabase(): Promise<D1TestSession> {
	const databaseId = `test-db-${crypto.randomUUID()}`;
	const mf = new Miniflare({
		workers: [
			{
				config: {
					compatibilityDate: "2026-08-22",
					compatibilityFlags: ["nodejs_compat"],
					env: {
						DB: {
							id: databaseId,
							type: "d1",
						},
					},
					manifest: {
						mainModule: "index.js",
						modules: {
							"index.js": {
								contents: Buffer.from(
									'export default { fetch() { return new Response("ok"); } }',
								),
								type: "esm",
							},
						},
					},
					name: "test-db-worker",
				},
			},
		],
	});

	// biome-ignore lint/nursery/noUnsafeTypeAssertion: Miniflare getD1Database returns authentic D1Database instance
	const d1 = (await mf.getD1Database("DB")) as unknown as D1Database;
	await applyD1Migrations(d1, drizzleMigrations);
	const db = drizzle(d1, { relations: postRelations });

	return {
		clearTables: async () => {
			await d1.batch([
				d1.prepare("DELETE FROM posts;"),
				d1.prepare("DELETE FROM session;"),
				d1.prepare("DELETE FROM account;"),
				d1.prepare("DELETE FROM verification;"),
				d1.prepare("DELETE FROM rate_limit;"),
				d1.prepare("DELETE FROM user;"),
			]);
		},
		close: async () => {
			await mf.dispose();
		},
		d1,
		db,
	};
}
