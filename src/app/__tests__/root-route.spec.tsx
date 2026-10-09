import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

vi.mock("@tanstack/react-router", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@tanstack/react-router")>();
	return {
		...actual,
		// biome-ignore lint/style/useNamingConvention: the mock must match the component export.
		HeadContent: () => null,
		// biome-ignore lint/style/useNamingConvention: the mock must match the component export.
		Scripts: () => null,
	};
});

vi.mock("@tanstack/react-devtools", () => ({
	// biome-ignore lint/style/useNamingConvention: the mock must match the component export.
	TanStackDevtools: () => null,
}));

vi.mock("@tanstack/react-router-devtools", () => ({
	// biome-ignore lint/style/useNamingConvention: the mock must match the component export.
	TanStackRouterDevtoolsPanel: () => null,
}));

import { Route } from "../routes/__root";

describe("Root Route", () => {
	test("head registers stylesheet link", () => {
		const head = Route.options.head;
		if (typeof head !== "function") {
			throw new Error("Expected Route.options.head to be a function");
		}
		// biome-ignore lint/nursery/noUnsafeTypeAssertion: accessing head return value in unit test
		const headResult = head({} as never) as {
			links?: Array<Record<string, unknown>>;
			meta?: Array<Record<string, unknown>>;
		};

		expect(headResult.links).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					rel: "stylesheet",
					href: expect.anything(),
				}),
			]),
		);
	});

	test("RootDocument does not inline stylesheet into style tag", () => {
		// biome-ignore lint/nursery/noUnsafeTypeAssertion: accessing shellComponent definition from route options
		// biome-ignore lint/suspicious/noExplicitAny: extracting shellComponent for rendering test
		const ShellComponent = (Route.options as any).shellComponent as React.FC<{
			children: React.ReactNode;
		}>;

		const { container } = render(
			<ShellComponent>
				<div data-testid="child">Hello</div>
			</ShellComponent>,
		);

		const styleTags = container.querySelectorAll("style");
		expect(styleTags.length).toBe(0);
	});
});
