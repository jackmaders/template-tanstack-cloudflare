import { describe, expect, test, vi } from "vitest";
import * as postHandlers from "../api/post-handlers";
import { postListServerFn } from "../api/post.functions";

vi.mock("../api/post-handlers", () => ({
	postListHandler: vi.fn(),
}));

describe("postListServerFn", () => {
	test("calls postListHandler and returns its result", async () => {
		const mockPosts = [{ id: 1, name: "Test Post", createdAt: new Date() }];
		vi.mocked(postHandlers.postListHandler).mockResolvedValueOnce(mockPosts);

		// biome-ignore lint/nursery/noUnsafeTypeAssertion: test invocation of serverFn
		const result = await (postListServerFn as unknown as () => Promise<unknown>)();
		expect(postHandlers.postListHandler).toHaveBeenCalled();
		expect(result).toEqual(mockPosts);
	});
});
