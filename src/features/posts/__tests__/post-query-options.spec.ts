import { QueryClient, type QueryFunctionContext } from "@tanstack/react-query";
import { describe, expect, test, vi } from "vitest";
import { postListServerFn } from "../api/post.functions";
import { postListQueryOptions } from "../api/post-query-options";

vi.mock("../api/post.functions");

describe("postListQueryOptions", () => {
	test("defines queryKey and queryFn correctly", async () => {
		expect(postListQueryOptions.queryKey).toEqual(["posts"]);
		expect(postListQueryOptions.staleTime).toBe(30_000);

		vi.mocked(postListServerFn).mockResolvedValueOnce([
			{ id: 1, name: "Sample", createdAt: new Date() },
		]);

		expect(postListQueryOptions.queryFn).toBeDefined();
		const queryContext: QueryFunctionContext<
			typeof postListQueryOptions.queryKey
		> = {
			client: new QueryClient(),
			meta: undefined,
			queryKey: postListQueryOptions.queryKey,
			signal: new AbortController().signal,
		};
		const result = await postListQueryOptions.queryFn?.(queryContext);
		expect(result).toHaveLength(1);
		expect(postListServerFn).toHaveBeenCalled();
	});
});
