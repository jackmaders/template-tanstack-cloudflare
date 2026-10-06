import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { HomePage } from "../ui/home-page";

vi.mock("@tanstack/react-query", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@tanstack/react-query")>();
	return {
		...actual,
		useSuspenseQuery: vi.fn(() => ({
			data: [
				{ id: 1, name: "Sample Post 1", createdAt: new Date() },
				{ id: 2, name: "Sample Post 2", createdAt: new Date() },
			],
		})),
	};
});

vi.mock("@/features/post-create/index.async", () => ({
	PostCreateForm: () => <div data-testid="mock-post-create-form" />,
}));

vi.mock("@/features/session-manage/index.async", () => ({
	SessionPanel: () => <div data-testid="mock-session-panel" />,
}));

vi.mock("@/widgets/post-feed", () => ({
	PostFeed: ({ posts }: { posts: unknown[] }) => (
		<div data-testid="mock-post-feed">{posts.length} posts</div>
	),
}));

describe("HomePage", () => {
	test("renders header, metrics, and feature sections", () => {
		render(<HomePage />);

		expect(screen.getByText("TanStack Start + Cloudflare")).toBeInTheDocument();
		expect(screen.getByText("Edge online")).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: /Build fast on the/i }),
		).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument(); // metric post count
		expect(screen.getByTestId("mock-session-panel")).toBeInTheDocument();
		expect(screen.getByTestId("mock-post-create-form")).toBeInTheDocument();
		expect(screen.getByTestId("mock-post-feed")).toBeInTheDocument();
	});
});
