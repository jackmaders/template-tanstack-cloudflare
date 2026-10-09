import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { HomePage } from "../routes/index";

const headingPattern = /Build fast on the/i;

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

vi.mock("@/features/auth/auth-client", () => ({
	authClient: {
		useSession: () => ({ data: null, isPending: false }),
	},
}));

vi.mock("@/features/posts/components/post-create-form", () => ({
	// biome-ignore lint/style/useNamingConvention: mock component
	PostCreateForm: () => <div data-testid="mock-post-create-form" />,
}));

vi.mock("@/features/auth/components/session-panel", () => ({
	// biome-ignore lint/style/useNamingConvention: mock component
	SessionPanel: () => <div data-testid="mock-session-panel" />,
}));

vi.mock("@/features/posts/components/post-feed", () => ({
	// biome-ignore lint/style/useNamingConvention: mock component
	PostFeed: ({ posts }: { posts: unknown[] }) => (
		<div data-testid="mock-post-feed">{posts.length} posts</div>
	),
}));

describe("HomePage", () => {
	test("renders the template introduction and posts example", () => {
		render(<HomePage />);

		expect(
			screen.getByText("TanStack Start + Cloudflare starter template."),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: headingPattern }),
		).toBeInTheDocument();
		expect(screen.getByText("Cloudflare D1")).toBeInTheDocument();
		expect(screen.getByText("2 posts")).toBeInTheDocument();
		expect(screen.getByTestId("mock-post-create-form")).toBeInTheDocument();
		expect(screen.getByTestId("mock-session-panel")).toBeInTheDocument();
		expect(screen.getByTestId("mock-post-feed")).toBeInTheDocument();
	});
});
