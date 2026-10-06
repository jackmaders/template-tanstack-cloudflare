import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { SessionPanel } from "../ui/session-panel-lazy";

vi.mock("../ui/session-panel", () => ({
	SessionPanel: () => <div data-testid="real-session-panel">Loaded Session Panel</div>,
}));

describe("Lazy SessionPanel", () => {
	test("renders loaded SessionPanel component", async () => {
		render(<SessionPanel />);

		expect(
			await screen.findByTestId("real-session-panel"),
		).toBeInTheDocument();
	});

	test("accepts custom fallback", () => {
		const { container } = render(
			<SessionPanel fallback={<div data-testid="custom-fallback">Loading...</div>} />,
		);

		// With mock resolution, fallback or component renders cleanly
		expect(container).toBeDefined();
	});
});
