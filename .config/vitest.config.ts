import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
		alias: {
			"cloudflare:workers": new URL(
				"../__mocks__/cloudflare/workers.ts",
				import.meta.url,
			).pathname,
		},
	},
	test: {
		mockReset: true,
		environment: "happy-dom",
		globals: true,
		include: ["src/**/__tests__/*.spec.{ts,tsx}"],
		setupFiles: ["@testing-library/jest-dom/vitest"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			include: [
				"src/entities/**/*.{ts,tsx}",
				"src/features/**/*.{ts,tsx}",
				"src/widgets/**/*.{ts,tsx}",
				"src/shared/**/*.{ts,tsx}",
			],
			exclude: [
				"**/*.spec.{ts,tsx}",
				"**/__tests__/**",
				"**/__mocks__/**",
				"**/index.ts",
				"**/index.async.ts",
				"**/index.server.ts",
				"**/index.client.ts",
				"src/shared/db/schema/**",
				"src/shared/db/seed/**",
				"src/shared/db/db.server.ts",
				"src/shared/auth/auth.server.ts",
				"src/shared/auth/auth-client.ts",
				"src/shared/auth/auth.functions.ts",
				"src/shared/auth/admin.functions.ts",
				"src/shared/auth/auth-middleware.ts",
				"src/shared/auth/admin-middleware.ts",
				"src/shared/errors/server-error-middleware.ts",
				"src/features/session-manage/ui/session-panel-lazy.tsx",
				"src/features/session-manage/ui/session-panel-fallback.tsx",
				"src/features/post-create/ui/post-create-form-lazy.tsx",
				"src/features/post-create/ui/post-create-form-fallback.tsx",
				"src/features/post-create/api/post-create.functions.ts",
				"src/entities/post/api/post.functions.ts",
				"src/entities/post/model/post-types.ts",
				"src/shared/lib/utils.ts",
			],
			thresholds: {
				lines: 100,
				functions: 100,
				branches: 100,
				statements: 100,
			},
		},
	},
});
