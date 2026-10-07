import { renderHook } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { usePostCreateMutation } from "../api/use-post-create-mutation";

type MutationOptions = {
	mutationFn: (data: { name: string }) => Promise<unknown>;
	onSuccess?: () => void | Promise<void>;
};

const mutationMock = vi.hoisted(() => {
	let options: MutationOptions | undefined;
	return {
		captureOptions: (nextOptions: MutationOptions) => {
			options = nextOptions;
		},
		getOptions: () => options,
		invalidateQueries: vi.fn(),
	};
});

vi.mock("@tanstack/react-query", () => ({
	useQueryClient: () => ({ invalidateQueries: mutationMock.invalidateQueries }),
	useMutation: (options: MutationOptions) => {
		mutationMock.captureOptions(options);
		return options;
	},
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
		renderHook(() => usePostCreateMutation());
		const options = mutationMock.getOptions();

		expect(options?.mutationFn).toBeDefined();
		expect(typeof options?.onSuccess).toBe("function");

		await options?.mutationFn({ name: "hello" });

		await options?.onSuccess?.();
		expect(mutationMock.invalidateQueries).toHaveBeenCalledWith({
			queryKey: ["posts"],
		});
	});
});
