import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { setTestClientIp } from "./test-client";

const password = "e2e-password-123";
const adminPassword = "e2e-admin-password-123";
const adminEmail = "admin@example.com";
const homeUrlPattern = /\/$/;

test("anonymous visitors cannot enter the Admin workspace", async ({
	page,
}) => {
	await page.goto("/admin");

	await expect(page).toHaveURL(homeUrlPattern);
});

test("regular Users cannot enter the Admin workspace", async ({ page }) => {
	const email = `e2e-user-${crypto.randomUUID()}@example.com`;

	await signUp(page, email);
	await page.goto("/admin");

	await expect(page).toHaveURL(homeUrlPattern);
});

test("Admins can enter the Admin workspace", async ({ page }) => {
	await signInAsAdmin(page);
	await page.goto("/admin");

	await expect(
		page.getByRole("heading", { name: "Admin Dashboard" }),
	).toBeVisible();
});

async function signUp(page: Page, email: string) {
	await setTestClientIp(page);
	await page.goto("/");
	await page
		.getByRole("button", { name: "Need an account? Create one" })
		.click();
	await page
		.getByRole("textbox", { name: "Name", exact: true })
		.fill("E2E Admin Access");
	await page.getByLabel("Email").fill(email);
	await page.getByLabel("Password").fill(password);
	await page.getByRole("button", { name: "Create account" }).click();
	await expect(page.getByText("Signed in", { exact: true })).toBeVisible();
}

async function signInAsAdmin(page: Page) {
	await setTestClientIp(page);
	await page.goto("/");
	await page.locator('html[data-hydrated="true"]').waitFor();
	await expect(page.getByText("Authentication")).toBeVisible();
	await page.getByLabel("Email").fill(adminEmail);
	await page.getByLabel("Password").fill(adminPassword);

	const signInResponsePromise = page.waitForResponse(
		(response) =>
			new URL(response.url()).pathname === "/api/auth/sign-in/email" &&
			response.request().method() === "POST",
	);
	await page.getByRole("button", { name: "Sign in" }).click();
	const signInResponse = await signInResponsePromise;
	expect(signInResponse.ok()).toBe(true);
	await expect(page.getByText("Signed in", { exact: true })).toBeVisible();
}
