import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { usePostCreateMutation } from "../api/use-post-create-mutation";

type MutationOptions = {
	mutationFn: (data: { name: string }) => Promise<unknown>;
	onSuccess?: () => void | Promise<void>;
};

vi.mock("@tanstack/react-query");
vi.mock("@tanstack/react-start");
vi.mock("../api/post-create.functions");

describe("usePostCreateMutation", () => {
	test("creates mutation options and invalidates query on success", async () => {
		const invalidateQueriesMock = vi.fn();
		vi.mocked(useQueryClient).mockReturnValue({
			invalidateQueries: invalidateQueriesMock,
			// biome-ignore lint/nursery/noUnsafeTypeAssertion: test double for query client
		} as never);

		renderHook(() => usePostCreateMutation());
		// biome-ignore lint/nursery/noUnsafeTypeAssertion: extract mutation options passed to mock
		const [options] = vi.mocked(useMutation).mock.calls[0] as [MutationOptions];

		expect(options.mutationFn).toBeDefined();
		expect(typeof options.onSuccess).toBe("function");

		await options.mutationFn({ name: "hello" });

		await options.onSuccess?.();
		expect(invalidateQueriesMock).toHaveBeenCalledWith({
			queryKey: ["posts"],
		});
	});
});
