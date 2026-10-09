import { describe, expect, test, vi } from "vitest";
import { postCreateServerFn } from "../api/post-create.functions";
import { postCreateHandler } from "../api/post-create-handlers";

vi.mock("../api/post-create-handlers");
vi.mock("@/shared/auth");

describe("postCreateServerFn", () => {
	test("calls postCreateHandler with provided data", async () => {
		const mockCreated = { id: 1, name: "New Post", createdAt: new Date() };
		vi.mocked(postCreateHandler).mockResolvedValueOnce(mockCreated);

		const result = await postCreateServerFn({ data: { name: "New Post" } });

		expect(postCreateHandler).toHaveBeenCalledWith({
			name: "New Post",
		});
		expect(result).toEqual(mockCreated);
	});
});
