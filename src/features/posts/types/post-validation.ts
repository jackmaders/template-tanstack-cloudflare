import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import { posts } from "@/db";

export const postSelectSchema = createSelectSchema(posts);
export const postInsertSchema = createInsertSchema(posts);
