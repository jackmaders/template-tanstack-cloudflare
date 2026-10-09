import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
		alias: {
			"cloudflare:workers": new URL(
				"../__mocks__/cloudflare-workers.ts",
				import.meta.url,
			).pathname,
		},
	},
	test: {
		mockReset: true,
		environment: "happy-dom",
		globals: true,
		include: ["src/**/__tests__/*.spec.{ts,tsx}"],
		setupFiles: [
			"@testing-library/jest-dom/vitest",
			new URL("../__mocks__/react-start.ts", import.meta.url).pathname,
		],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				"**/*.spec.{ts,tsx}",
				"**/__tests__/**",
				"**/__mocks__/**",
				"**/index*.ts",
				"src/app/**",
				"src/cloudflare-env.d.ts",
				"src/shared/db/**",
				"src/shared/auth/**",
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
