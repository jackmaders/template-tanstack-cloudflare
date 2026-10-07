import { describe, expect, test, vi } from "vitest";
import { postCreateServerFn } from "../api/post-create.functions";
import * as postCreateHandlers from "../api/post-create-handlers";

vi.mock("../api/post-create-handlers", () => ({
	postCreateHandler: vi.fn(),
}));

vi.mock("@/shared/auth", () => ({
	authMiddleware: vi.fn(),
}));

describe("postCreateServerFn", () => {
	test("calls postCreateHandler with provided data", async () => {
		const mockCreated = { id: 1, name: "New Post", createdAt: new Date() };
		vi.mocked(postCreateHandlers.postCreateHandler).mockResolvedValueOnce(
			mockCreated,
		);

		// biome-ignore lint/nursery/noUnsafeTypeAssertion: test invocation of serverFn handler
		const serverFn = postCreateServerFn as unknown as (args: {
			data: { name: string };
		}) => Promise<unknown>;
		const result = await serverFn({ data: { name: "New Post" } });

		expect(postCreateHandlers.postCreateHandler).toHaveBeenCalledWith({
			name: "New Post",
		});
		expect(result).toEqual(mockCreated);
	});
});
