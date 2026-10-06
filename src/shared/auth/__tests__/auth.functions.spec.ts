import { describe, expect, test, vi } from "vitest";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { ensureSession } from "../auth.functions";
import { auth } from "../auth.server";

vi.mock("@tanstack/react-start/server", () => ({
	getRequestHeaders: vi.fn(() => new Headers()),
}));

vi.mock("../auth.server", () => ({
	auth: {
		api: {
			getSession: vi.fn(),
		},
	},
}));

describe("ensureSession", () => {
	test("returns session when session exists", async () => {
		const mockSession = {
			user: { id: "u1", name: "User 1" },
			session: { id: "s1" },
		};
		vi.mocked(auth.api.getSession).mockResolvedValueOnce(mockSession as never);

		const result = await ensureSession();
		expect(getRequestHeaders).toHaveBeenCalled();
		expect(result).toEqual(mockSession);
	});

	test("throws Unauthorized error when session does not exist", async () => {
		vi.mocked(auth.api.getSession).mockResolvedValueOnce(null as never);

		await expect(ensureSession()).rejects.toThrow("Unauthorized");
	});
});
