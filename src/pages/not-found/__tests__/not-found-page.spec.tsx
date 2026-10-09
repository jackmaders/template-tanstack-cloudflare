import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { NotFoundPage } from "../ui/not-found-page";

vi.mock("@tanstack/react-router", () => ({
	// biome-ignore lint/style/useNamingConvention: component mock
	Link: ({ to, children }: { to: string; children?: React.ReactNode }) => (
		<a data-testid="router-link" href={to}>
			{children}
		</a>
	),
}));

describe("not-found page", () => {
	test("renders 404 heading and return home button", () => {
		render(<NotFoundPage />);

		expect(screen.getByText("Page not found")).toBeInTheDocument();
		expect(
			screen.getByText("That route could not be found."),
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "Return home" }),
		).toBeInTheDocument();
	});
});
