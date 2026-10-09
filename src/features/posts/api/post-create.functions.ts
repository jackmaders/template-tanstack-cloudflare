import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/api/auth-middleware";
import type { PostInsert } from "../types/post-types";
import { postCreateHandler } from "./post-create-handlers";

export const postCreateServerFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	// The handler parses runtime input; this identity validator preserves the client type.
	.validator((data: PostInsert) => data)
	.handler(({ data }) => postCreateHandler(data));
