import { describe, expect, test, vi } from "vitest";
import { postListServerFn } from "../api/post.functions";
import { postListHandler } from "../api/post-handlers";

vi.mock("../api/post-handlers");

describe("postListServerFn", () => {
	test("calls postListHandler and returns its result", async () => {
		const mockPosts = [
			{ id: 1, name: "Test Post", authorId: null, createdAt: new Date() },
		];
		vi.mocked(postListHandler).mockResolvedValueOnce(mockPosts);

		const result = await postListServerFn();
		expect(postListHandler).toHaveBeenCalled();
		expect(result).toEqual(mockPosts);
	});
});
