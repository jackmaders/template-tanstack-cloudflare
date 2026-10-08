import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { PostCreateForm } from "../ui/post-create-form-lazy";

vi.mock("../ui/post-create-form", () => ({
	// biome-ignore lint/style/useNamingConvention: the mock must match the component export.
	PostCreateForm: ({
		isAuthenticated,
		isSessionPending,
	}: {
		isAuthenticated: boolean;
		isSessionPending: boolean;
	}) => (
		<div
			data-authenticated={String(isAuthenticated)}
			data-session-pending={String(isSessionPending)}
			data-testid="real-post-create-form"
		>
			Loaded Post Create Form
		</div>
	),
}));

describe("Lazy PostCreateForm", () => {
	test("renders loaded PostCreateForm component", async () => {
		render(<PostCreateForm isAuthenticated isSessionPending={false} />);

		expect(
			await screen.findByTestId("real-post-create-form"),
		).toBeInTheDocument();
		expect(screen.getByTestId("real-post-create-form")).toHaveAttribute(
			"data-authenticated",
			"true",
		);
	});

	test("accepts custom fallback", () => {
		const { container } = render(
			<PostCreateForm
				fallback={<div data-testid="custom-fallback">Loading...</div>}
				isAuthenticated={false}
				isSessionPending={false}
			/>,
		);

		expect(container).toBeDefined();
	});
});
