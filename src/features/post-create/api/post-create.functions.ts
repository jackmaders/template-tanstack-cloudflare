import { createServerFn } from "@tanstack/react-start";
import type { PostInsert } from "@/entities/post";
import { authMiddleware } from "@/shared/auth";
import { postCreateHandler } from "./post-create-handlers";

export const postCreateServerFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	// The handler parses runtime input; this identity validator preserves the client type.
	.validator((data: PostInsert) => data)
	.handler(({ data }) => postCreateHandler(data));
