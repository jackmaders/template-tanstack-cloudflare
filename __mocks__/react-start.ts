import { vi } from "vitest";

// Mock @tanstack/react-start createServerFn to allow testing handler implementations in unit tests
vi.mock("@tanstack/react-start", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@tanstack/react-start")>();
	return {
		...actual,
		createServerFn: (options?: unknown) => {
			const builder: {
				options?: unknown;
				middleware: (m: unknown) => typeof builder;
				validator: (v: unknown) => typeof builder;
				handler: (h: (...args: unknown[]) => unknown) => unknown;
			} = {
				options,
				middleware: () => builder,
				validator: (v: unknown) => {
					if (typeof v === "function") {
						// biome-ignore lint/nursery/noUnsafeTypeAssertion: dummy invocation to execute validator in tests
						v({} as never);
					}
					return builder;
				},
				handler: (h: (...args: unknown[]) => unknown) => {
					const fn = (...args: unknown[]) => h(...args);
					// biome-ignore lint/nursery/noUnsafeTypeAssertion: test handler attachment
					(fn as unknown as { handler: typeof h }).handler = h;
					return fn;
				},
			};
			return builder;
		},
		createServerOnlyFn: (fn: unknown) => fn,
	};
});
