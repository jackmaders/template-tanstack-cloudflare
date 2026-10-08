import { test as baseTest, expect } from "@playwright/test";

export const test = baseTest.extend({
	page: async ({ page }, use, testInfo) => {
		const browserErrors: string[] = [];
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

		expect(browserErrors, `Browser errors in "${testInfo.title}"`).toEqual([]);
	},
});

export { expect };
