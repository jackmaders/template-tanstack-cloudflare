import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
} from "vitest";
import { user } from "@/shared/db";
import {
	createTestDatabase,
	type D1TestSession,
} from "../../../../__mocks__/d1-database";
import { postCreateHandler } from "../api/post-create-handlers";

describe("postCreateHandler", () => {
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

	test("inserts a post and returns the created record", async () => {
		const result = await postCreateHandler(
			{ name: "Brand New Post" },
			session.db,
		);

		expect(result).toMatchObject({
			name: "Brand New Post",
		});
		expect(result.id).toBeDefined();
		expect(result.createdAt).toBeDefined();
	});

	test("inserts a post with authorId and persists it", async () => {
		await session.db.insert(user).values({
			id: "author-user-1",
			name: "Bob",
			email: "bob@example.com",
		});

		const result = await postCreateHandler(
			{ name: "Post with Author", authorId: "author-user-1" },
			session.db,
		);

		expect(result).toMatchObject({
			name: "Post with Author",
			authorId: "author-user-1",
		});
	});

	test("throws validation error for invalid input", async () => {
		await expect(
			postCreateHandler({ name: 123 }, session.db),
		).rejects.toThrow();
	});
});
