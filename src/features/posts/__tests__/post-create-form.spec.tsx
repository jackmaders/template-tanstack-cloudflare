import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { usePostCreateMutation } from "../api/use-post-create-mutation";
import { PostCreateForm } from "../components/post-create-form";

vi.mock("../api/use-post-create-mutation");

describe("PostCreateForm", () => {
	test("renders the post name field and submit button", () => {
		renderPostCreateForm();

		expect(screen.getByLabelText("Post name")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Add post" }),
		).toBeInTheDocument();
	});

	test("creates a post and clears the form", async () => {
		const user = userEvent.setup();
		renderPostCreateForm();

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

		renderPostCreateForm();

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
		renderPostCreateForm({ isAuthenticated: false });

		await user.type(screen.getByLabelText("Post name"), "Anonymous post");
		await user.click(screen.getByRole("button", { name: "Add post" }));

		expect(screen.getByRole("alert")).toHaveTextContent(
			"Sign in to create a post.",
		);
		expect(usePostCreateMutation().mutateAsync).not.toHaveBeenCalled();
	});

	test("does not create a post when the name is blank", async () => {
		const user = userEvent.setup();
		renderPostCreateForm();

		const input = screen.getByLabelText("Post name");
		await user.type(input, "   ");

		await act(() =>
			user.click(screen.getByRole("button", { name: "Add post" })),
		);

		expect(usePostCreateMutation().mutateAsync).not.toHaveBeenCalled();
	});

	test("does not submit when session check is pending", async () => {
		const user = userEvent.setup();
		const { container } = renderPostCreateForm({ isSessionPending: true });

		const input = screen.getByLabelText("Post name");
		await user.type(input, "Pending session post");

		const form = container.querySelector("form");
		if (form) {
			const { fireEvent } = await import("@testing-library/react");
			fireEvent.submit(form);
		}

		expect(usePostCreateMutation().mutateAsync).not.toHaveBeenCalled();
	});

	test("renders pending state when mutation is pending", () => {
		vi.mocked(usePostCreateMutation).mockReturnValueOnce({
			isPending: true,
			mutateAsync: vi.fn(),
			// biome-ignore lint/nursery/noUnsafeTypeAssertion: this test only needs the pending fields from the mutation result.
		} as never);

		renderPostCreateForm();

		const button = screen.getByRole("button", { name: "Adding..." });
		expect(button).toBeDisabled();
	});
});

function renderPostCreateForm({
	isAuthenticated = true,
	isSessionPending = false,
}: Partial<{ isAuthenticated: boolean; isSessionPending: boolean }> = {}) {
	return render(
		<PostCreateForm
			isAuthenticated={isAuthenticated}
			isSessionPending={isSessionPending}
		/>,
	);
}
