// biome-ignore-all lint/nursery/noUnsafeTypeAssertion: Better Auth response fixtures omit unobserved response fields.

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { authClient } from "../auth-client";
import { SessionPanel } from "../components/session-panel";

vi.mock("../auth-client");

describe("SessionPanel", () => {
	beforeEach(() => {
		vi.mocked(authClient.signIn.email).mockResolvedValue({
			error: null,
		} as never);
		vi.mocked(authClient.signOut).mockResolvedValue({} as never);
		vi.mocked(authClient.signUp.email).mockResolvedValue({
			error: null,
		} as never);
	});

	test("shows a pending session state", () => {
		render(<SessionPanel isPending />);

		expect(screen.getByText("Checking the current session…")).toBeVisible();
	});

	test("shows the signed-in user and signs out on request", async () => {
		const user = userEvent.setup();
		render(
			<SessionPanel
				isPending={false}
				user={{ email: "admin@example.com", name: "Admin" }}
			/>,
		);

		expect(screen.getByText("admin@example.com")).toBeVisible();
		await user.click(screen.getByRole("button", { name: "Sign out" }));
		expect(authClient.signOut).toHaveBeenCalledOnce();
	});

	test("signs in with form values", async () => {
		const user = userEvent.setup();
		render(<SessionPanel isPending={false} />);

		await user.type(screen.getByLabelText("Email"), "person@example.com");
		await user.type(screen.getByLabelText("Password"), "password-123");
		await user.click(screen.getByRole("button", { name: "Sign in" }));

		await waitFor(() => {
			expect(authClient.signIn.email).toHaveBeenCalledWith({
				email: "person@example.com",
				password: "password-123",
			});
		});
	});

	test("shows sign-in response errors and clears them when switching modes", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
			error: { message: "Invalid credentials" },
		} as never);
		render(<SessionPanel isPending={false} />);

		await user.type(screen.getByLabelText("Email"), "person@example.com");
		await user.type(screen.getByLabelText("Password"), "password-123");
		await user.click(screen.getByRole("button", { name: "Sign in" }));
		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Invalid credentials",
		);

		await user.click(
			screen.getByRole("button", { name: "Need an account? Create one" }),
		);
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
		expect(screen.getByLabelText("Name")).toBeVisible();
	});

	test("uses the fallback sign-in error message when no message is returned", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
			error: {},
		} as never);
		render(<SessionPanel isPending={false} />);

		await user.type(screen.getByLabelText("Email"), "person@example.com");
		await user.type(screen.getByLabelText("Password"), "password-123");
		await user.click(screen.getByRole("button", { name: "Sign in" }));

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Unable to sign in.",
		);
	});

	test("creates an account with the entered name, email, and password", async () => {
		const user = userEvent.setup();
		render(<SessionPanel isPending={false} />);

		await user.click(
			screen.getByRole("button", { name: "Need an account? Create one" }),
		);
		await user.type(screen.getByLabelText("Name"), "New Operator");
		await user.type(screen.getByLabelText("Email"), "new@example.com");
		await user.type(screen.getByLabelText("Password"), "password-123");
		await user.click(screen.getByRole("button", { name: "Create account" }));

		await waitFor(() => {
			expect(authClient.signUp.email).toHaveBeenCalledWith({
				email: "new@example.com",
				name: "New Operator",
				password: "password-123",
			});
		});
	});

	test("shows the fallback account creation error and switches back to sign in", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.signUp.email).mockResolvedValueOnce({
			error: {},
		} as never);
		render(<SessionPanel isPending={false} />);

		await user.click(
			screen.getByRole("button", { name: "Need an account? Create one" }),
		);
		await user.type(screen.getByLabelText("Name"), "New Operator");
		await user.type(screen.getByLabelText("Email"), "new@example.com");
		await user.type(screen.getByLabelText("Password"), "password-123");
		await user.click(screen.getByRole("button", { name: "Create account" }));
		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Unable to create the account.",
		);

		await user.click(
			screen.getByRole("button", { name: "Already have an account? Sign in" }),
		);
		expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Sign in" })).toBeVisible();
	});

	test("shows the unavailable service message when authentication rejects", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.signIn.email).mockRejectedValueOnce(
			new Error("offline"),
		);
		render(<SessionPanel isPending={false} />);

		await user.type(screen.getByLabelText("Email"), "person@example.com");
		await user.type(screen.getByLabelText("Password"), "password-123");
		await user.click(screen.getByRole("button", { name: "Sign in" }));

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"The auth service is unavailable. Check your server configuration.",
		);
	});
});
