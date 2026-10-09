import { vi } from "vitest";

export const useSuspenseQuery = vi.fn(() => ({
	data: [
		{ id: 1, name: "Sample Post 1", createdAt: new Date() },
		{ id: 2, name: "Sample Post 2", createdAt: new Date() },
	],
}));

export const useQueryClient = vi.fn(() => ({
	invalidateQueries: vi.fn(),
}));

export const useMutation = vi.fn((options: unknown) => {
	if (typeof options === "object" && options !== null) {
		return {
			isPending: false,
			mutateAsync: vi.fn(),
			...options,
		};
	}
	return {
		isPending: false,
		mutateAsync: vi.fn(),
	};
});

export const queryOptions = vi.fn((options) => options);
