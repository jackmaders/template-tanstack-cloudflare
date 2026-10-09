import { getRequestHeaders } from "@tanstack/react-start/server";
import { describe, expect, test, vi } from "vitest";
import { getSession } from "../api/auth.functions";
import { auth } from "../api/auth.server";

vi.mock("@tanstack/react-start/server", () => ({
	getRequestHeaders: vi.fn(() => new Headers()),
}));

vi.mock("../api/auth.server", () => ({
	auth: {
		api: {
			getSession: vi.fn(),
		},
	},
}));

describe("getSession", () => {
	test("returns session when session exists", async () => {
		const mockSession = {
			user: { id: "u1", name: "User 1" },
			session: { id: "s1" },
		};
		// biome-ignore lint/nursery/noUnsafeTypeAssertion: fixture omits unrelated Better Auth session fields.
		vi.mocked(auth.api.getSession).mockResolvedValueOnce(mockSession as never);

		const result = await getSession();
		expect(getRequestHeaders).toHaveBeenCalled();
		expect(result).toEqual(mockSession);
	});

	test("returns null when session does not exist", async () => {
		vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

		await expect(getSession()).resolves.toBeNull();
	});
});
