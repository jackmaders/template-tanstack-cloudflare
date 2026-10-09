import { describe, expect, test, vi } from "vitest";
import { ensureAdminAccessServerFn } from "../api/admin.functions";

vi.mock("../api/admin-middleware", () => ({
	adminMiddleware: vi.fn(),
}));

describe("ensureAdminAccessServerFn", () => {
	test("returns no session data", async () => {
		const mockSession = { user: { id: "a1", role: "admin" } };

		// biome-ignore lint/nursery/noUnsafeTypeAssertion: test invocation of serverFn handler
		const serverFn = ensureAdminAccessServerFn as unknown as (args: {
			context: { session: typeof mockSession };
		}) => Promise<unknown>;

		const result = await serverFn({ context: { session: mockSession } });
		expect(result).toBeUndefined();
	});
});
