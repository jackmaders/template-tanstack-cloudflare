import { createMiddleware } from "@tanstack/react-start";
import { ServerFunctionError } from "@/shared/errors";
import { getSession } from "./auth.functions";

export const authMiddleware = createMiddleware({ type: "function" }).server(
	async ({ next }) => {
		const session = await getSession();

		if (!session) {
			throw new ServerFunctionError("Unauthorized", 401);
		}

		return next({ context: { session } });
	},
);
