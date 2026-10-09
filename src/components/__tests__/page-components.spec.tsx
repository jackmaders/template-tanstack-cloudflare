import { Link } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { AdminWorkspace } from "../admin-workspace";
import { NotFoundPage } from "../not-found-page";

vi.mock("@tanstack/react-router");

const adminDescriptionPattern = /role-based access control/;

describe("AdminWorkspace", () => {
	test("describes the protected admin area", () => {
		render(<AdminWorkspace />);

		expect(
			screen.getByRole("heading", { name: "Admin Dashboard" }),
		).toBeVisible();
		expect(screen.getByText(adminDescriptionPattern)).toBeVisible();
	});
});

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
