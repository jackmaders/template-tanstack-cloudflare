import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
} from "vitest";
import { posts, user } from "@/db";
import { createTestDatabase, type D1TestSession } from "@/db/test/d1-database";
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

	test("supports relational queries with author relation via db.query", async () => {
		await session.db.insert(user).values({
			id: "user-test-1",
			name: "Alice",
			email: "alice@example.com",
		});

		await session.db.insert(posts).values({
			name: "Relational Post",
			authorId: "user-test-1",
		});

		const result = await session.db.query.posts.findMany({
			with: {
				author: true,
			},
		});

		expect(result).toHaveLength(1);
		expect(result[0]?.name).toBe("Relational Post");
		expect(result[0]?.author?.name).toBe("Alice");
	});
});
