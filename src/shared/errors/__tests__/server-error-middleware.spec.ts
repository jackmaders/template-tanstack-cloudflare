import { notFound, redirect } from "@tanstack/react-router";
import { setResponseStatus } from "@tanstack/react-start/server";
import { describe, expect, test, vi } from "vitest";
import { reportServerError } from "../report-server-error";
import { serverErrorMiddleware } from "../server-error-middleware";
import { ServerFunctionError } from "../server-function-error";

vi.mock("@tanstack/react-start/server");
vi.mock("../report-server-error");

describe("serverErrorMiddleware", () => {
	// biome-ignore lint/nursery/noUnsafeTypeAssertion: accessing server middleware handler
	const serverHandler = serverErrorMiddleware.options.server as (opts: {
		next: () => Promise<unknown>;
		serverFnMeta?: { name?: string };
	}) => Promise<unknown>;

	test("passes through successful next() call", async () => {
		const result = await serverHandler({
			next: async () => ({ ok: true }),
		});
		expect(result).toEqual({ ok: true });
	});

	test("rethrows redirects without reporting error or setting response status", async () => {
		const redirectErr = redirect({ href: "/login" });
		await expect(
			serverHandler({
				next: async () => {
					throw redirectErr;
				},
			}),
		).rejects.toBe(redirectErr);

		expect(vi.mocked(reportServerError)).not.toHaveBeenCalled();
		expect(setResponseStatus).not.toHaveBeenCalled();
	});

	test("rethrows notFound without reporting error or setting response status", async () => {
		const notFoundErr = notFound();
		await expect(
			serverHandler({
				next: async () => {
					throw notFoundErr;
				},
			}),
		).rejects.toBe(notFoundErr);

		expect(vi.mocked(reportServerError)).not.toHaveBeenCalled();
		expect(setResponseStatus).not.toHaveBeenCalled();
	});

	test("sets response status for ServerFunctionError and reports error", async () => {
		const err = new ServerFunctionError("Forbidden", 403);
		await expect(
			serverHandler({
				next: async () => {
					throw err;
				},
				serverFnMeta: { name: "testFn" },
			}),
		).rejects.toBe(err);

		expect(setResponseStatus).toHaveBeenCalledWith(403, "Forbidden");
		expect(vi.mocked(reportServerError)).toHaveBeenCalledWith(err, "testFn");
	});

	test("uses 'unknown' as default function name if serverFnMeta is not provided", async () => {
		const err = new Error("Generic failure");
		await expect(
			serverHandler({
				next: async () => {
					throw err;
				},
			}),
		).rejects.toBe(err);

		expect(vi.mocked(reportServerError)).toHaveBeenCalledWith(err, "unknown");
	});
});
