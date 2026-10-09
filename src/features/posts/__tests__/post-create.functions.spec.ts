import { describe, expect, test, vi } from "vitest";
import { postCreateServerFn } from "../api/post-create.functions";
import { postCreateHandler } from "../api/post-create-handlers";

vi.mock("../api/post-create-handlers", () => ({
	postCreateHandler: vi.fn(),
}));

vi.mock("@/features/auth/api/auth-middleware", () => ({
	authMiddleware: vi.fn(),
}));

describe("postCreateServerFn", () => {
	test("calls postCreateHandler with provided data and authenticated session authorId", async () => {
		const mockCreated = {
			id: 1,
			name: "New Post",
			authorId: "user-123",
			createdAt: new Date(),
		};
		vi.mocked(postCreateHandler).mockResolvedValueOnce(mockCreated);

		// biome-ignore lint/nursery/noUnsafeTypeAssertion: test invocation of serverFn handler with injected auth middleware context
		const serverFn = postCreateServerFn as unknown as (args: {
			data: { name: string };
			context: { session: { user: { id: string } } };
		}) => Promise<typeof mockCreated>;

		const result = await serverFn({
			data: { name: "New Post" },
			context: {
				session: {
					user: { id: "user-123" },
				},
			},
		});

		expect(postCreateHandler).toHaveBeenCalledWith({
			name: "New Post",
			authorId: "user-123",
		});
		expect(result).toEqual(mockCreated);
	});

	test("validates input and throws 400 ServerFunctionError for invalid data", () => {
		const serverFnWithMockValidator =
			// biome-ignore lint/nursery/noUnsafeTypeAssertion: access validator attached in mock
			postCreateServerFn as {
				validator?: (data: unknown) => unknown;
			};
		const validator = serverFnWithMockValidator.validator;

		expect(validator?.({ name: "Valid Post" })).toEqual({ name: "Valid Post" });
		expect(() => validator?.({ name: 123 })).toThrowError("Bad Request");
		expect(() => validator?.({})).toThrowError("Bad Request");
	});
});
