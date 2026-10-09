import { describe, expect, test } from "vitest";
import { resolveAuthBaseUrl } from "../auth.server";

describe("resolveAuthBaseUrl", () => {
	test("resolves origin from request headers origin when present", () => {
		const request = {
			headers: new Headers({ origin: "https://custom-domain.com" }),
			url: "https://worker.dev/api/auth/session",
		};
		expect(resolveAuthBaseUrl(request, "http://localhost:5173")).toBe(
			"https://custom-domain.com",
		);
	});

	test("resolves origin from request URL when origin header is absent", () => {
		const request = {
			headers: new Headers(),
			url: "https://worker.dev/api/auth/session",
		};
		expect(resolveAuthBaseUrl(request, "http://localhost:5173")).toBe(
			"https://worker.dev",
		);
	});

	test("falls back to fallbackUrl when request is not provided", () => {
		expect(resolveAuthBaseUrl(undefined, "http://localhost:5173")).toBe(
			"http://localhost:5173",
		);
	});
});
