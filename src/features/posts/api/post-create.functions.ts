import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/api/auth-middleware";
import { ServerFunctionError } from "@/shared/errors";
import type { PostInsert } from "../types/post-types";
import { postInsertSchema } from "../types/post-validation";
import { postCreateHandler } from "./post-create-handlers";

export const postCreateServerFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: PostInsert) => {
		const result = postInsertSchema.safeParse(data);
		if (!result.success) {
			throw new ServerFunctionError("Bad Request", 400);
		}
		return result.data;
	})
	.handler(({ data, context }) =>
		postCreateHandler({
			...data,
			authorId: context.session.user.id,
		}),
	);
