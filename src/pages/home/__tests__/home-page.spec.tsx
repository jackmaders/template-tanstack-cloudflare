import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { HomePage } from "../ui/home-page";

const headingPattern = /Build fast on the/i;

vi.mock("@tanstack/react-query");
vi.mock("@/shared/auth");
vi.mock("@/features/post-create/index.async");
vi.mock("@/features/session-manage/index.async");
vi.mock("@/widgets/post-feed");

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
