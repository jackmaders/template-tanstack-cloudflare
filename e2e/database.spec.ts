import { expect, test } from "./fixtures";
import { setTestClientIp } from "./test-client";

const postsCountPattern = /^Recent posts \((\d+)\)$/;

test("creates and reads a post from D1", async ({ page }) => {
	const postName = `E2E post ${crypto.randomUUID().split("-")[0]}`;
	const email = `e2e-${crypto.randomUUID()}@example.com`;

	await setTestClientIp(page);
	await page.goto("/");
	await page.locator('html[data-hydrated="true"]').waitFor();
	await expect(page.getByText("Authentication")).toBeVisible();
	await page
		.getByRole("button", { name: "Need an account? Create one" })
		.click();
	await page
		.getByRole("textbox", { name: "Name", exact: true })
		.fill("E2E Operator");
	await page.getByLabel("Email").fill(email);
	await page.getByLabel("Password").fill("e2e-password-123");
	const signUpResponsePromise = page.waitForResponse(
		(response) =>
			new URL(response.url()).pathname === "/api/auth/sign-up/email" &&
			response.request().method() === "POST",
	);
	await page.getByRole("button", { name: "Create account" }).click();
	const signUpResponse = await signUpResponsePromise;
	expect(signUpResponse.ok()).toBe(true);
	await expect(page.getByText("Signed in", { exact: true })).toBeVisible();

	const postsCount = page.getByText(postsCountPattern);
	const initialCountText = await postsCount.textContent();
	const initialCount = Number(initialCountText?.match(postsCountPattern)?.[1]);
	expect(Number.isInteger(initialCount)).toBe(true);

	await page.getByLabel("Post name").fill(postName);
	await page.getByRole("button", { name: "Add post" }).click();

	await expect(page.getByText(postName, { exact: true })).toBeVisible();
});
