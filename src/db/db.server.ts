import "@tanstack/react-start/server-only";

import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { postRelations } from "./index";

export function getDb(db: Parameters<typeof drizzle>[0] = env.DB) {
	return drizzle(db, { relations: postRelations });
}
