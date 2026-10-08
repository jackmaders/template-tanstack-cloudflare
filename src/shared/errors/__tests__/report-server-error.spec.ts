import { describe, expect, test, vi } from "vitest";
import { reportServerError } from "../report-server-error";
import { ServerFunctionError } from "../server-function-error";

describe("reportServerError", () => {
	test("logs warning for ServerFunctionError", () => {
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

		const err = new ServerFunctionError("Unauthorized", 401);
		reportServerError(err, "testOp");

		expect(warnSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				event: "server_function.error",
				operation: "testOp",
				expected: true,
				status: 401,
			}),
		);

		warnSpy.mockRestore();
	});

	test("logs error for unexpected Error", () => {
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		const err = new Error("Something broke");
		reportServerError(err, "testOp");

		expect(errorSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				event: "server_function.error",
				operation: "testOp",
				expected: false,
				// biome-ignore lint/style/useNamingConvention: preserve the structured log field name.
				error_message: "Something broke",
			}),
		);

		errorSpy.mockRestore();
	});

	test("handles non-Error objects safely", () => {
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		reportServerError("raw string error", "testOp");

		expect(errorSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				event: "server_function.error",
				operation: "testOp",
				expected: false,
				// biome-ignore lint/style/useNamingConvention: preserve the structured log field name.
				error_message: "raw string error",
			}),
		);

		errorSpy.mockRestore();
	});
});
