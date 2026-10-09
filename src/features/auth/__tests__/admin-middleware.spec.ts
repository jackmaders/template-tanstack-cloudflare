import { describe, expect, test, vi } from "vitest";
import { adminMiddleware } from "../api/admin-middleware";
import { getSession } from "../api/auth.functions";

vi.mock("../api/auth.functions");

describe("adminMiddleware", () => {
	// biome-ignore lint/nursery/noUnsafeTypeAssertion: access the middleware handler to verify its server boundary.
	const serverHandler = adminMiddleware.options.server as (options: {
		next: (options?: { context?: unknown }) => Promise<unknown>;
	}) => Promise<unknown>;

	test("redirects when no session exists", async () => {
		vi.mocked(getSession).mockResolvedValueOnce(null);
		const next = vi.fn();

		await expect(serverHandler({ next })).rejects.toMatchObject({
			options: { to: "/" },
		});
		expect(next).not.toHaveBeenCalled();
	});

	test("redirects when the session user is not an admin", async () => {
		const session = { user: { id: "user-1", role: "user" } };
		// biome-ignore lint/nursery/noUnsafeTypeAssertion: fixture omits unrelated Better Auth session fields.
		vi.mocked(getSession).mockResolvedValueOnce(session as never);
		const next = vi.fn();

		await expect(serverHandler({ next })).rejects.toMatchObject({
			options: { to: "/" },
		});
		expect(next).not.toHaveBeenCalled();
	});

	test("passes an admin session to the next handler", async () => {
		const session = { user: { id: "admin-1", role: "admin" } };
		// biome-ignore lint/nursery/noUnsafeTypeAssertion: fixture omits unrelated Better Auth session fields.
		vi.mocked(getSession).mockResolvedValueOnce(session as never);
		const next = vi.fn().mockResolvedValue("handled");

		await expect(serverHandler({ next })).resolves.toBe("handled");
		expect(next).toHaveBeenCalledWith({ context: { session } });
	});
});
