import { renderHook } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { usePostCreateMutation } from "../api/use-post-create-mutation";

const invalidateQueries = vi.fn();
vi.mock("@tanstack/react-query", () => ({
	useQueryClient: () => ({ invalidateQueries }),
	useMutation: (options: {
		mutationFn: (data: unknown) => unknown;
		onSuccess?: () => void;
	}) => options,
	queryOptions: (options: unknown) => options,
}));

vi.mock("@tanstack/react-start", () => ({
	useServerFn: (fn: unknown) => fn,
	createServerFn: () => ({
		handler: (h: unknown) => h,
	}),
}));

vi.mock("../api/post-create.functions", () => ({
	postCreateServerFn: vi.fn(),
}));

describe("usePostCreateMutation", () => {
	test("creates mutation options and invalidates query on success", async () => {
		const { result } = renderHook(() =>
			usePostCreateMutation(),
		) as unknown as {
			result: {
				current: {
					mutationFn: (data: unknown) => Promise<unknown>;
					onSuccess?: () => void;
				};
			};
		};

		expect(result.current.mutationFn).toBeDefined();
		expect(typeof result.current.onSuccess).toBe("function");

		await result.current.mutationFn({ name: "hello" });
		expect(result.current.mutationFn).toBeDefined();

		result.current.onSuccess?.();
		expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["posts"] });
	});
});
