import { posts } from "@/db";
import { getDb } from "@/db/index.server";
import { postInsertSchema, postSelectSchema } from "../types/post-validation";

export async function postCreateHandler(data: unknown, db = getDb()) {
	const input = postInsertSchema.parse(data);
	const [post] = await db.insert(posts).values(input).returning();
	return postSelectSchema.parse(post);
}
