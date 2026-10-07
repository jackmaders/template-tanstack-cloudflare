import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { usePostCreateMutation } from "../api/use-post-create-mutation";
import { PostCreateForm } from "../ui/post-create-form";

const authState = vi.hoisted(() => ({ isAuthenticated: true }));

vi.mock("@/shared/auth", () => ({
	authClient: {
		useSession: () => ({
			data: authState.isAuthenticated ? { user: { id: "user-1" } } : null,
			isPending: false,
		}),
	},
}));

vi.mock("../api/use-post-create-mutation");

describe("PostCreateForm", () => {
	beforeEach(() => {
		authState.isAuthenticated = true;
	});

	test("renders the post name field and submit button", () => {
		render(<PostCreateForm />);

		expect(screen.getByLabelText("Post name")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Add post" }),
		).toBeInTheDocument();
	});

	test("creates a post and clears the form", async () => {
		const user = userEvent.setup();
		render(<PostCreateForm />);

		const input = screen.getByLabelText("Post name");
		await user.type(input, "First post");

		await act(() =>
			user.click(screen.getByRole("button", { name: "Add post" })),
		);

		expect(usePostCreateMutation().mutateAsync).toHaveBeenCalledWith({
			name: "First post",
		});
		expect(input).toHaveValue("");
	});

	test("displays an error message when submission fails", async () => {
		const user = userEvent.setup();
		vi.mocked(usePostCreateMutation().mutateAsync).mockRejectedValueOnce(
			new Error("Failed"),
		);

		render(<PostCreateForm />);

		const input = screen.getByLabelText("Post name");
		await user.type(input, "Failed post");

		await act(() =>
			user.click(screen.getByRole("button", { name: "Add post" })),
		);

		expect(screen.getByRole("alert")).toHaveTextContent(
			"Sign in to create a post.",
		);
	});

	test("prompts anonymous users without calling the server function", async () => {
		const user = userEvent.setup();
		authState.isAuthenticated = false;
		render(<PostCreateForm />);

		await user.type(screen.getByLabelText("Post name"), "Anonymous post");
		await user.click(screen.getByRole("button", { name: "Add post" }));

		expect(screen.getByRole("alert")).toHaveTextContent(
			"Sign in to create a post.",
		);
		expect(usePostCreateMutation().mutateAsync).not.toHaveBeenCalled();
	});

	test("does not create a post when the name is blank", async () => {
		const user = userEvent.setup();
		render(<PostCreateForm />);

		const input = screen.getByLabelText("Post name");
		await user.type(input, "   ");

		await act(() =>
			user.click(screen.getByRole("button", { name: "Add post" })),
		);

		expect(usePostCreateMutation().mutateAsync).not.toHaveBeenCalled();
	});

	test("renders pending state when mutation is pending", () => {
		vi.mocked(usePostCreateMutation).mockReturnValueOnce({
			isPending: true,
			mutateAsync: vi.fn(),
			// biome-ignore lint/nursery/noUnsafeTypeAssertion: this test only needs the pending fields from the mutation result.
		} as never);

		render(<PostCreateForm />);

		const button = screen.getByRole("button", { name: "Adding..." });
		expect(button).toBeDisabled();
	});
});
