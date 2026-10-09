import "@tanstack/react-start/server-only";

import { env } from "cloudflare:workers";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth/minimal";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { account, rateLimit, session, user, verification } from "@/shared/db";
import { getDb } from "@/shared/db/index.server";

export function resolveAuthBaseUrl(
	request?: {
		headers?: Headers | { get(name: string): string | null };
		url?: string;
	},
	fallbackUrl = env.BETTER_AUTH_URL,
): string {
	if (request) {
		const origin = request.headers?.get("origin");
		if (origin) {
			return origin;
		}
		if (request.url) {
			try {
				return new URL(request.url).origin;
			} catch {
				// fall through to fallbackUrl
			}
		}
	}
	return fallbackUrl;
}

export const auth = betterAuth({
	baseURL: (request) => resolveAuthBaseUrl(request),
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
