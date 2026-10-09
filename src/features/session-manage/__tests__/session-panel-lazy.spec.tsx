import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { SessionPanel } from "../ui/session-panel-lazy";

vi.mock("../ui/session-panel", () => ({
	// biome-ignore lint/style/useNamingConvention: the mock must match the component export.
	SessionPanel: ({
		isPending,
		user,
	}: {
		isPending: boolean;
		user?: { email: string; name: string };
	}) => (
		<div
			data-pending={String(isPending)}
			data-testid="real-session-panel"
			data-user={user ? user.email : "none"}
		>
			Loaded Session Panel
		</div>
	),
}));

describe("Lazy SessionPanel", () => {
	test("renders loaded SessionPanel component", async () => {
		render(
			<SessionPanel
				isPending={false}
				user={{ email: "test@example.com", name: "Test User" }}
			/>,
		);

		expect(await screen.findByTestId("real-session-panel")).toBeInTheDocument();
		expect(screen.getByTestId("real-session-panel")).toHaveAttribute(
			"data-user",
			"test@example.com",
		);
	});

	test("accepts custom fallback", () => {
		const { container } = render(
			<SessionPanel
				fallback={<div data-testid="custom-fallback">Loading...</div>}
				isPending
			/>,
		);

		expect(container).toBeDefined();
	});
});
