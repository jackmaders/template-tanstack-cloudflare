import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getSession } from "./auth.functions";
import { hasAdminPermission } from "./auth-roles";

export const adminMiddleware = createMiddleware({ type: "function" }).server(
	async ({ next }) => {
		const session = await getSession();

		if (!session || !hasAdminPermission(session.user)) {
			throw redirect({ to: "/" });
		}

		return next({ context: { session } });
	},
);
