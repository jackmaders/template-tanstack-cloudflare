import { test as baseTest, expect } from "@playwright/test";

export const test = baseTest.extend({
	page: async ({ page }, use, testInfo) => {
		const browserErrors: string[] = [];
		const sessionRequests: string[] = [];
		const sessionResponses: string[] = [];
		const sessionRequestFailures: string[] = [];

		page.on("request", (request) => {
			if (new URL(request.url()).pathname === "/api/auth/get-session") {
				sessionRequests.push(request.url());
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

		expect(
			{
				browserErrors,
				pageURL: page.url(),
				sessionRequests,
				sessionResponses,
				sessionRequestFailures,
			},
			`Browser errors in "${testInfo.title}"`,
		).toEqual({
			browserErrors: [],
			pageURL: page.url(),
			sessionRequests,
			sessionResponses,
			sessionRequestFailures,
		});
	},
});

export { expect };
