import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { HomePage } from "../routes/index";

const headingPattern = /Build fast on the/i;

vi.mock("@tanstack/react-query");
vi.mock("@/features/auth/auth-client");
vi.mock("@/features/posts/components/post-create-form");
vi.mock("@/features/auth/components/session-panel");
vi.mock("@/features/posts/components/post-feed");

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
