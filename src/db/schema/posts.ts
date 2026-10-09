import { defineRelations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

export const posts = sqliteTable("posts", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	authorId: text("author_id").references(() => user.id, {
		onDelete: "cascade",
	}),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
});

export const postRelations = defineRelations({ user, posts }, (r) => ({
	user: {
		posts: r.many.posts(),
	},
	posts: {
		author: r.one.user({
			from: r.posts.authorId,
			to: r.user.id,
		}),
	},
}));
