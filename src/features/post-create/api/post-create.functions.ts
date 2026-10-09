import { createServerFn } from "@tanstack/react-start";
import { type PostInsert, postInsertSchema } from "@/entities/post";
import { authMiddleware } from "@/shared/auth";
import { ServerFunctionError } from "@/shared/errors";
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
