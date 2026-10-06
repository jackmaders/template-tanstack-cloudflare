import type { SQLiteAsyncDatabase } from "drizzle-orm/sqlite-core/async";
import { posts } from "../schema/posts";

export type SeedableDatabase = SQLiteAsyncDatabase<"sync" | "async", unknown>;

export async function seed(db: SeedableDatabase) {
	await db
		.insert(posts)
		.values([
			{ name: "Welcome to your new TanStack Start + Cloudflare project!" },
			{ name: "This sample post demonstrates Drizzle ORM + D1 integration." },
		])
		.onConflictDoNothing();
}

const LOCAL_DATABASE_DIRECTORY =
	".wrangler/state/v3/d1/miniflare-D1DatabaseObject";

async function findLocalDatabasePath(): Promise<string> {
	const { readdir } = await import("node:fs/promises");
	const { join } = await import("node:path");
	const databasePath = process.env.LOCAL_D1_DATABASE_PATH;

	if (databasePath) {
		return databasePath;
	}

	const entries = await readdir(LOCAL_DATABASE_DIRECTORY, {
		withFileTypes: true,
	});
	const databaseFiles = entries
		.filter(
			(entry) =>
				entry.isFile() &&
				entry.name.endsWith(".sqlite") &&
				entry.name !== "metadata.sqlite",
		)
		.map((entry) => join(LOCAL_DATABASE_DIRECTORY, entry.name));

	const firstFile = databaseFiles[0];
	if (databaseFiles.length !== 1 || !firstFile) {
		throw new Error(
			"Expected one local D1 database. Run `bun run db:migrate` first, or set LOCAL_D1_DATABASE_PATH.",
		);
	}

	return firstFile;
}

async function runLocalSeed() {
	const { default: Database } = await import("better-sqlite3");
	const { drizzle } = await import("drizzle-orm/better-sqlite3");
	const database = new Database(await findLocalDatabasePath());

	try {
		await seed(drizzle({ client: database }));
	} finally {
		database.close();
	}
}

if (import.meta.main) {
	runLocalSeed()
		.then(() => process.stdout.write("Seeded the local D1 database.\n"))
		.catch((error: unknown) => {
			process.stderr.write(
				`${error instanceof Error ? error.message : String(error)}\n`,
			);
			process.exitCode = 1;
		});
}
