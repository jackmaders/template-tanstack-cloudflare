import { beforeEach, describe, expect, test, vi } from "vitest";

describe("authClient", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	test("uses the browser origin as its base URL", async () => {
		const { createAuthClient } = await import("better-auth/react");
		await import("../auth-client");

		expect(createAuthClient).toHaveBeenCalledWith({
			baseURL: window.location.origin,
		});
	});

	test("omits the base URL when loaded outside the browser", async () => {
		vi.stubGlobal("window", undefined);
		try {
			const { createAuthClient } = await import("better-auth/react");
			await import("../auth-client");
			expect(createAuthClient).toHaveBeenCalledWith({ baseURL: undefined });
		} finally {
			vi.unstubAllGlobals();
		}
	});
});
