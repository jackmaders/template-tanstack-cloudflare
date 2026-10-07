import { test as baseTest, expect } from "@playwright/test";

export const test = baseTest.extend({
	page: async ({ page }, use, testInfo) => {
		const browserErrors: string[] = [];
		const sessionRequests: string[] = [];
		const sessionRequestHeaders: string[] = [];
		const sessionResponses: string[] = [];
		const sessionRequestFailures: string[] = [];

		await page.route("**/api/auth/get-session", async (route) => {
			const request = route.request();
			const headers = await request.allHeaders();
			sessionRequestHeaders.push(
				JSON.stringify({
					method: request.method(),
					url: request.url(),
					origin: headers.origin,
					referer: headers.referer,
					accessControlRequestHeaders:
						headers["access-control-request-headers"],
				}),
			);
			await route.continue();
		});

		page.on("request", (request) => {
			if (new URL(request.url()).pathname === "/api/auth/get-session") {
				sessionRequests.push(`${request.method()} ${request.url()}`);
			}
		});
		page.on("response", (response) => {
			if (new URL(response.url()).pathname === "/api/auth/get-session") {
				const headers = response.headers();
				sessionResponses.push(
					`${response.status()} ${response.url()} ` +
						`allow-origin=${headers["access-control-allow-origin"] ?? "<missing>"} ` +
						`location=${headers.location ?? "<none>"}`,
				);
			}
		});
		page.on("requestfailed", (request) => {
			if (new URL(request.url()).pathname === "/api/auth/get-session") {
				sessionRequestFailures.push(
					`${request.url()} (${request.failure()?.errorText ?? "unknown failure"})`,
				);
			}
		});

		page.on("console", (message) => {
			if (message.type() === "error") {
				browserErrors.push(`console.error: ${message.text()}`);
			}
		});
		page.on("pageerror", (error) => {
			browserErrors.push(
				`uncaught page error at ${page.url()}: ${error.stack ?? error.message}`,
			);
		});

		await use(page);

		const diagnostics = JSON.stringify(
			{
				pageURL: page.url(),
				sessionRequests,
				sessionRequestHeaders,
				sessionResponses,
				sessionRequestFailures,
			},
			null,
			2,
		);
		expect(
			browserErrors,
			`Browser errors in "${testInfo.title}"\n${diagnostics}`,
		).toEqual([]);
	},
});

export { expect };
