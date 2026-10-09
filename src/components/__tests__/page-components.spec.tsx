import { Link } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { NotFoundPage } from "../not-found-page";

vi.mock("@tanstack/react-router");

describe("unknown route page", () => {
	test("offers a link back to the home page", () => {
		render(<NotFoundPage />);

		expect(screen.getByText("Page not found")).toBeVisible();
		expect(screen.getByText("Return home")).toBeVisible();
		expect(Link).toHaveBeenCalledWith(
			expect.objectContaining({ to: "/" }),
			undefined,
		);
	});
});
