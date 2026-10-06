import { describe, expect, test, vi } from "vitest";
import { requireAdminServerFn } from "../admin.functions";

vi.mock("../admin-middleware", () => ({
	adminMiddleware: vi.fn(),
}));

describe("requireAdminServerFn", () => {
	test("returns session from context", async () => {
		const mockSession = { user: { id: "a1", role: "admin" } };

		// biome-ignore lint/nursery/noUnsafeTypeAssertion: test invocation of serverFn handler
		const serverFn = requireAdminServerFn as unknown as (args: {
			context: { session: typeof mockSession };
		}) => Promise<unknown>;

		const result = await serverFn({ context: { session: mockSession } });
		expect(result).toEqual(mockSession);
	});
});
