import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { hasAdminPermission } from "../auth-roles";
import { getSession } from "./auth.functions";

export const adminMiddleware = createMiddleware({ type: "function" }).server(
	async ({ next }) => {
		const session = await getSession();

		if (!session || !hasAdminPermission(session.user)) {
			throw redirect({ to: "/" });
		}

		return next({ context: { session } });
	},
);
