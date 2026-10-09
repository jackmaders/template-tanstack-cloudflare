import { afterEach, describe, expect, test } from "vitest";
import { posts } from "@/shared/db";
import { createMockDatabase } from "../../../../__mocks__/drizzle";
import { postListHandler } from "../api/post-handlers";

describe("postListHandler", () => {
	const sessions: Array<ReturnType<typeof createMockDatabase>> = [];

	afterEach(() => {
		for (const session of sessions.splice(0)) {
			session.close();
		}
	});

	test("returns empty array when no posts exist", async () => {
		const session = createMockDatabase();
		sessions.push(session);

		// biome-ignore lint/nursery/noUnsafeTypeAssertion: in-memory sqlite mock driver for test
		const result = await postListHandler(session.db as never);
		expect(result).toEqual([]);
	});

	test("returns list of posts from database", async () => {
		const session = createMockDatabase();
		sessions.push(session);

		await session.db
			.insert(posts)
			.values([{ name: "First Post" }, { name: "Second Post" }]);

		// biome-ignore lint/nursery/noUnsafeTypeAssertion: in-memory sqlite mock driver for test
		const result = await postListHandler(session.db as never);
		expect(result).toHaveLength(2);
		expect(result[0]?.name).toBe("First Post");
		expect(result[1]?.name).toBe("Second Post");
	});
});
