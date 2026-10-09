// biome-ignore-all lint/security/noSecrets: Test mock environment contains simulated dev secrets.
// biome-ignore-all lint/style/useNamingConvention: Cloudflare worker bindings adhere to UPPERCASE environment variable convention.

import { createTestDatabase, type D1TestSession } from "@/db/test/d1-database";

export const testDbSession: D1TestSession = await createTestDatabase();

export const env = {
	DB: testDbSession.d1,
	BETTER_AUTH_SECRET: "test-secret-12345678901234567890",
	BETTER_AUTH_URL: "http://localhost:5173",
};
