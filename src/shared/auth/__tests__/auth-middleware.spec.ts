import { describe, expect, test, vi } from "vitest";
import { ServerFunctionError } from "@/shared/errors";
import { getSession } from "../auth.functions";
import { authMiddleware } from "../auth-middleware";

vi.mock("../auth.functions");

describe("authMiddleware", () => {
	// biome-ignore lint/nursery/noUnsafeTypeAssertion: access the middleware handler to verify its server boundary.
	const serverHandler = authMiddleware.options.server as (options: {
		next: (options?: { context?: unknown }) => Promise<unknown>;
	}) => Promise<unknown>;

	test("rejects unauthenticated calls before invoking the handler", async () => {
		vi.mocked(getSession).mockResolvedValueOnce(null);
		const next = vi.fn();

		await expect(serverHandler({ next })).rejects.toEqual(
			new ServerFunctionError("Unauthorized", 401),
		);
		expect(next).not.toHaveBeenCalled();
	});
});
