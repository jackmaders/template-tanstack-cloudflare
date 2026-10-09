import { afterEach, describe, expect, test } from "vitest";
import { createMockDatabase } from "../../../../__mocks__/drizzle";
import { postCreateHandler } from "../api/post-create-handlers";

describe("postCreateHandler", () => {
	const sessions: Array<ReturnType<typeof createMockDatabase>> = [];

	afterEach(() => {
		for (const session of sessions.splice(0)) {
			session.close();
		}
	});

	test("inserts a post and returns the created record", async () => {
		const session = createMockDatabase();
		sessions.push(session);

		const result = await postCreateHandler(
			{ name: "Brand New Post" },
			// biome-ignore lint/nursery/noUnsafeTypeAssertion: the in-memory SQLite driver replaces the D1 driver in this unit test.
			session.db as never,
		);

		expect(result).toMatchObject({
			name: "Brand New Post",
		});
		expect(result.id).toBeDefined();
		expect(result.createdAt).toBeDefined();
	});

	test("throws validation error for invalid input", async () => {
		const session = createMockDatabase();
		sessions.push(session);

		await expect(
			postCreateHandler(
				{ name: 123 },
				// biome-ignore lint/nursery/noUnsafeTypeAssertion: the in-memory SQLite driver replaces the D1 driver in this unit test.
				session.db as never,
			),
		).rejects.toThrow();
	});
});
