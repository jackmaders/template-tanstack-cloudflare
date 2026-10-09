import { vi } from "vitest";

export const createFileRoute = vi.fn(() => vi.fn((options) => ({ options })));
export const createRootRouteWithContext = vi.fn(
	() => (options: Record<string, unknown>) => ({
		options,
	}),
);
export const HeadContent = () => null;
export const Scripts = () => null;
export const Link = vi.fn(({ children }) => children);
