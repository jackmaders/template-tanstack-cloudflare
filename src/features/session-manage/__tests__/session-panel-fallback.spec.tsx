import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SessionPanelFallback } from "../ui/session-panel-fallback";

describe("SessionPanelFallback", () => {
	test("renders placeholder message and custom className", () => {
		const { container } = render(
			<SessionPanelFallback className="custom-test" />,
		);
		expect(
			screen.getByText("Checking the current session…"),
		).toBeInTheDocument();
		expect(container.firstChild).toHaveClass("custom-test");
	});
});
