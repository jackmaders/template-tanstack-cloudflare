import "@tanstack/react-start/server-only";

import { env } from "cloudflare:workers";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth/minimal";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { account, rateLimit, session, user, verification } from "@/shared/db";
import { getDb } from "@/shared/db/index.server";

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	database: drizzleAdapter(getDb(), {
		provider: "sqlite",
		schema: { account, rateLimit, session, user, verification },
		transaction: false,
	}),
	emailAndPassword: {
		enabled: true,
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: false,
				defaultValue: "user",
				input: false,
			},
		},
	},
	secret: env.BETTER_AUTH_SECRET,
	rateLimit: {
		enabled: true,
		window: 10,
		max: 100,
		storage: "database",
	},
	advanced: {
		ipAddress: {
			ipAddressHeaders: ["cf-connecting-ip", "x-forwarded-for"],
		},
	},
	plugins: [tanstackStartCookies()],
});
