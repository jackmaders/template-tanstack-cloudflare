import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { authClient } from "@/shared/auth";
import { SessionPanel } from "../ui/session-panel";

vi.mock("@/shared/auth", () => ({
	authClient: {
		useSession: vi.fn(),
		signIn: { email: vi.fn() },
		signUp: { email: vi.fn() },
		signOut: vi.fn(),
	},
}));

describe("SessionPanel", () => {
	test("renders fallback when session is pending", () => {
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: true,
			error: null,
		} as never);

		const { container } = render(<SessionPanel />);
		expect(container.firstChild).toBeInTheDocument();
	});

	test("renders authenticated state and handles sign out", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.useSession).mockReturnValue({
			data: {
				user: { id: "u1", name: "Jane Doe", email: "jane@example.com" },
				session: { id: "s1" },
			},
			isPending: false,
			error: null,
		} as never);

		render(<SessionPanel />);

		expect(screen.getByText("Jane Doe")).toBeInTheDocument();
		expect(screen.getByText("jane@example.com")).toBeInTheDocument();

		const signOutBtn = screen.getByRole("button", { name: "Sign out" });
		await user.click(signOutBtn);
		expect(authClient.signOut).toHaveBeenCalled();
	});

	test("submits sign in form successfully", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
			error: null,
		} as never);
		vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
			data: {} as never,
			error: null,
		});

		render(<SessionPanel />);

		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await act(() => user.click(screen.getByRole("button", { name: "Sign in" })));

		expect(authClient.signIn.email).toHaveBeenCalledWith({
			callbackURL: "/",
			email: "test@example.com",
			password: "password123",
		});
	});

	test("handles sign in error response", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
			error: null,
		} as never);
		vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
			data: null,
			error: { message: "Invalid credentials" } as never,
		});

		render(<SessionPanel />);

		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.type(screen.getByLabelText("Password"), "wrongpass");
		await act(() => user.click(screen.getByRole("button", { name: "Sign in" })));

		expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
	});

	test("submits sign up form and handles sign up error", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
			error: null,
		} as never);
		vi.mocked(authClient.signUp.email).mockResolvedValueOnce({
			data: null,
			error: { message: "Email already taken" } as never,
		});

		render(<SessionPanel />);

		await user.click(
			screen.getByRole("button", { name: "Need an account? Create one" }),
		);

		await user.type(screen.getByLabelText("Name"), "New User");
		await user.type(screen.getByLabelText("Email"), "new@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await act(() =>
			user.click(screen.getByRole("button", { name: "Create account" })),
		);

		expect(authClient.signUp.email).toHaveBeenCalledWith({
			callbackURL: "/",
			name: "New User",
			email: "new@example.com",
			password: "password123",
		});
		expect(screen.getByText("Email already taken")).toBeInTheDocument();
	});

	test("handles network exception during submission", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
			error: null,
		} as never);
		vi.mocked(authClient.signIn.email).mockRejectedValueOnce(
			new Error("Network failed"),
		);

		render(<SessionPanel />);

		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await act(() => user.click(screen.getByRole("button", { name: "Sign in" })));

		expect(
			screen.getByText(
				"The auth service is unavailable. Check your server configuration.",
			),
		).toBeInTheDocument();
	});

	test("handles sign in error fallback when message is null or empty", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
			error: null,
		} as never);
		vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
			data: null,
			error: { message: undefined } as never,
		});

		render(<SessionPanel />);

		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await act(() => user.click(screen.getByRole("button", { name: "Sign in" })));

		expect(screen.getByText("Unable to sign in.")).toBeInTheDocument();
	});

	test("submits sign up form successfully and handles fallback error", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
			error: null,
		} as never);
		vi.mocked(authClient.signUp.email).mockResolvedValueOnce({
			data: {} as never,
			error: null,
		});

		render(<SessionPanel />);

		const toggleBtn = screen.getByRole("button", {
			name: "Need an account? Create one",
		});
		await user.click(toggleBtn);

		await user.type(screen.getByLabelText("Name"), "New User");
		await user.type(screen.getByLabelText("Email"), "new@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await act(() =>
			user.click(screen.getByRole("button", { name: "Create account" })),
		);

		expect(authClient.signUp.email).toHaveBeenCalled();

		// Toggle back to sign in
		const toggleBackBtn = screen.getByRole("button", {
			name: "Already have an account? Sign in",
		});
		await user.click(toggleBackBtn);
		expect(
			screen.getByRole("button", { name: "Sign in" }),
		).toBeInTheDocument();
	});

	test("handles sign up error fallback when message is empty", async () => {
		const user = userEvent.setup();
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
			error: null,
		} as never);
		vi.mocked(authClient.signUp.email).mockResolvedValueOnce({
			data: null,
			error: { message: undefined } as never,
		});

		render(<SessionPanel />);

		await user.click(
			screen.getByRole("button", { name: "Need an account? Create one" }),
		);

		await user.type(screen.getByLabelText("Name"), "User");
		await user.type(screen.getByLabelText("Email"), "u@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await act(() =>
			user.click(screen.getByRole("button", { name: "Create account" })),
		);

		expect(
			screen.getByText("Unable to create the account."),
		).toBeInTheDocument();
	});
});
