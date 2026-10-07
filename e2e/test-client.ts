import type { Page } from "@playwright/test";

export async function setTestClientIp(page: Page) {
	const lastOctet = Math.floor(Math.random() * 254) + 1;
	await page.setExtraHTTPHeaders({
		"cf-connecting-ip": `192.0.2.${lastOctet}`,
	});
}
