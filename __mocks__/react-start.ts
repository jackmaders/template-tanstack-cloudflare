import { vi } from "vitest";

// Mock @tanstack/react-start createServerFn to allow testing handler implementations in unit tests
vi.mock("@tanstack/react-start", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@tanstack/react-start")>();
	return {
		...actual,
		createServerFn: (options?: unknown) => {
			type MockServerFnBuilder = {
				options?: unknown;
				validatorFn?: unknown;
				middleware: (m: unknown) => MockServerFnBuilder;
				validator: (v: unknown) => MockServerFnBuilder;
				handler: (h: (...args: unknown[]) => unknown) => unknown;
			};
			const builder: MockServerFnBuilder = {
				options,
				middleware: () => builder,
				validator: (v: unknown) => {
					builder.validatorFn = v;
					return builder;
				},
				handler: (h: (...args: unknown[]) => unknown) => {
					const fn = Object.assign((...args: unknown[]) => h(...args), {
						handler: h,
						validator: builder.validatorFn,
					});
					return fn;
				},
			};
			return builder;
		},
		createServerOnlyFn: (fn: unknown) => fn,
		useServerFn: (fn: unknown) => fn,
	};
});
