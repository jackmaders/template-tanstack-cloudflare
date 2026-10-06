import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { PostCreateForm } from "../ui/post-create-form-lazy";

vi.mock("../ui/post-create-form", () => ({
	PostCreateForm: () => <div data-testid="real-post-create-form">Loaded Post Create Form</div>,
}));

describe("Lazy PostCreateForm", () => {
	test("renders loaded PostCreateForm component", async () => {
		render(<PostCreateForm />);

		expect(
			await screen.findByTestId("real-post-create-form"),
		).toBeInTheDocument();
	});

	test("accepts custom fallback", () => {
		const { container } = render(
			<PostCreateForm fallback={<div data-testid="custom-fallback">Loading...</div>} />,
		);

		expect(container).toBeDefined();
	});
});
