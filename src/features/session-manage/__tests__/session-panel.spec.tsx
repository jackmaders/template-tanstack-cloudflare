// biome-ignore-all lint/nursery/noUnsafeTypeAssertion: test mocks for better-auth client responses

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { authClient } from "@/shared/auth";
import { SessionPanel } from "../ui/session-panel";

vi.mock("@/shared/auth", () => ({
	authClient: {
		signOut: vi.fn(),
		signIn: {
			email: vi.fn(),
		},
		signUp: {
			email: vi.fn(),
		},
	},
}));

describe("SessionPanel", () => {
	test("renders fallback when session is pending", () => {
		render(<SessionPanel isPending />);

		expect(
			screen.getByText("Checking the current session…"),
		).toBeInTheDocument();
	});

	test("renders user details and triggers signOut", async () => {
		const user = userEvent.setup();
		render(
			<SessionPanel
				isPending={false}
				user={{ email: "operator@example.com", name: "Operator One" }}
			/>,
		);

		expect(screen.getByText("Operator One")).toBeInTheDocument();
		expect(screen.getByText("operator@example.com")).toBeInTheDocument();
		expect(screen.getByText("Signed in")).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Sign out" }));
		expect(authClient.signOut).toHaveBeenCalled();
	});

	test("signs in successfully in sign-in mode", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
			data: { user: { id: "1", email: "test@example.com" } },
			error: null,
		} as never);

		render(<SessionPanel isPending={false} />);

		expect(screen.getByText("Welcome back")).toBeInTheDocument();

		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");

		await act(async () => {
			await user.click(screen.getByRole("button", { name: "Sign in" }));
		});

		expect(authClient.signIn.email).toHaveBeenCalledWith({
			email: "test@example.com",
			password: "password123",
		});
	});

	test("displays error when sign-in returns an error", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
			data: null,
			error: { message: "Invalid credentials", status: 401 },
		} as never);

		render(<SessionPanel isPending={false} />);

		await user.type(screen.getByLabelText("Email"), "wrong@example.com");
		await user.type(screen.getByLabelText("Password"), "wrongpassword");

		await act(async () => {
			await user.click(screen.getByRole("button", { name: "Sign in" }));
		});

		expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials");
	});

	test("displays default sign-in error message when error has no message", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
			data: null,
			error: {},
		} as never);

		render(<SessionPanel isPending={false} />);

		await user.type(screen.getByLabelText("Email"), "wrong@example.com");
		await user.type(screen.getByLabelText("Password"), "wrongpassword");

		await act(async () => {
			await user.click(screen.getByRole("button", { name: "Sign in" }));
		});

		expect(screen.getByRole("alert")).toHaveTextContent("Unable to sign in.");
	});

	test("toggles to sign-up mode and signs up successfully", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.signUp.email).mockResolvedValueOnce({
			data: { user: { id: "2", email: "new@example.com" } },
			error: null,
		} as never);

		render(<SessionPanel isPending={false} />);

		await user.click(
			screen.getByRole("button", { name: "Need an account? Create one" }),
		);
		expect(screen.getByText("Create an operator account")).toBeInTheDocument();

		await user.type(screen.getByLabelText("Name"), "New Operator");
		await user.type(screen.getByLabelText("Email"), "new@example.com");
		await user.type(screen.getByLabelText("Password"), "newpassword123");

		await act(async () => {
			await user.click(screen.getByRole("button", { name: "Create account" }));
		});

		expect(authClient.signUp.email).toHaveBeenCalledWith({
			email: "new@example.com",
			name: "New Operator",
			password: "newpassword123",
		});
	});

	test("displays error when sign-up returns an error", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.signUp.email).mockResolvedValueOnce({
			data: null,
			error: { message: "Account already exists" },
		} as never);

		render(<SessionPanel isPending={false} />);

		await user.click(
			screen.getByRole("button", { name: "Need an account? Create one" }),
		);
		await user.type(screen.getByLabelText("Name"), "Existing User");
		await user.type(screen.getByLabelText("Email"), "exists@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");

		await act(async () => {
			await user.click(screen.getByRole("button", { name: "Create account" }));
		});

		expect(screen.getByRole("alert")).toHaveTextContent(
			"Account already exists",
		);
	});

	test("displays default error message when sign-up error has no message", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.signUp.email).mockResolvedValueOnce({
			data: null,
			error: {},
		} as never);

		render(<SessionPanel isPending={false} />);

		await user.click(
			screen.getByRole("button", { name: "Need an account? Create one" }),
		);
		await user.type(screen.getByLabelText("Name"), "User");
		await user.type(screen.getByLabelText("Email"), "user@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");

		await act(async () => {
			await user.click(screen.getByRole("button", { name: "Create account" }));
		});

		expect(screen.getByRole("alert")).toHaveTextContent(
			"Unable to create the account.",
		);
	});

	test("handles auth service throw error gracefully", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.signIn.email).mockRejectedValueOnce(
			new Error("Network Error"),
		);

		render(<SessionPanel isPending={false} />);

		await user.type(screen.getByLabelText("Email"), "throw@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");

		await act(async () => {
			await user.click(screen.getByRole("button", { name: "Sign in" }));
		});

		expect(screen.getByRole("alert")).toHaveTextContent(
			"The auth service is unavailable. Check your server configuration.",
		);
	});

	test("clears error when toggling back and forth between modes", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.signIn.email).mockRejectedValueOnce(new Error("Fail"));

		render(<SessionPanel isPending={false} />);

		await user.type(screen.getByLabelText("Email"), "toggle@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");

		await act(async () => {
			await user.click(screen.getByRole("button", { name: "Sign in" }));
		});
		expect(screen.getByRole("alert")).toBeInTheDocument();

		await user.click(
			screen.getByRole("button", { name: "Need an account? Create one" }),
		);
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();

		await user.click(
			screen.getByRole("button", { name: "Already have an account? Sign in" }),
		);
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});
});
