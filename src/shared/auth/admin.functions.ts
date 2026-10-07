import { createServerFn } from "@tanstack/react-start";
import { adminMiddleware } from "./admin-middleware";

export const ensureAdminAccessServerFn = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.handler(() => undefined);
