import { desc } from "drizzle-orm";
import { posts } from "@/shared/db";
import { getDb } from "@/shared/db/index.server";
import { postSelectSchema } from "../types/post-validation";

export async function postListHandler(db = getDb()) {
	const result = await db
		.select()
		.from(posts)
		.orderBy(desc(posts.createdAt))
		.limit(50);
	return postSelectSchema.array().parse(result);
}
