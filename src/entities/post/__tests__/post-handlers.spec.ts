import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
} from "vitest";
import { posts } from "@/shared/db";
import { createTestDatabase, type D1TestSession } from "@/test/d1-database";
import { postListHandler } from "../api/post-handlers";

describe("postListHandler", () => {
	let session: D1TestSession;

	beforeAll(async () => {
		session = await createTestDatabase();
	});

	afterAll(async () => {
		await session.close();
	});

	beforeEach(async () => {
		await session.clearTables();
	});

	test("returns empty array when no posts exist", async () => {
		const result = await postListHandler(session.db);
		expect(result).toEqual([]);
	});

	test("returns list of posts from database ordered by createdAt descending", async () => {
		await session.db
			.insert(posts)
			.values([{ name: "First Post" }, { name: "Second Post" }]);

		const result = await postListHandler(session.db);
		expect(result).toHaveLength(2);
		expect(result.map((post) => post.name)).toContain("First Post");
		expect(result.map((post) => post.name)).toContain("Second Post");
	});
});
