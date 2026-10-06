import { describe, expect, test, vi } from "vitest";
import { postListQueryOptions } from "../api/post-query-options";
import { postListServerFn } from "../api/post.functions";

vi.mock("../api/post.functions", () => ({
	postListServerFn: vi.fn(),
}));

describe("postListQueryOptions", () => {
	test("defines queryKey and queryFn correctly", async () => {
		expect(postListQueryOptions.queryKey).toEqual(["posts"]);
		expect(postListQueryOptions.staleTime).toBe(30_000);

		vi.mocked(postListServerFn).mockResolvedValueOnce([
			{ id: 1, name: "Sample", createdAt: new Date() },
		]);

		expect(postListQueryOptions.queryFn).toBeDefined();
		const result = await postListQueryOptions.queryFn?.({} as never);
		expect(result).toHaveLength(1);
		expect(postListServerFn).toHaveBeenCalled();
	});
});
