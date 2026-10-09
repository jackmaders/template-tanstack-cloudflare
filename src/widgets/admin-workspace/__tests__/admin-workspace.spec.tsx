import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { AdminWorkspace } from "../ui/admin-workspace";

describe("AdminWorkspace", () => {
	test("renders admin workspace heading and description", () => {
		render(<AdminWorkspace />);

		expect(
			screen.getByRole("heading", { name: "Admin Dashboard" }),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				"Protected route demonstrating role-based access control with Better Auth and TanStack Router.",
			),
		).toBeInTheDocument();
	});
});
