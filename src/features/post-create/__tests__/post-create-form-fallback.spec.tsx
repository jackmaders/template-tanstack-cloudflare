import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { PostCreateFormFallback } from "../ui/post-create-form-fallback";

describe("PostCreateFormFallback", () => {
	test("renders disabled inputs and prevents submit", () => {
		const { container } = render(<PostCreateFormFallback />);
		const form = container.querySelector("form");
		expect(form).toHaveAttribute("aria-busy", "true");

		if (form) {
			fireEvent.submit(form);
		}

		const input = screen.getByPlaceholderText("A signal worth keeping");
		expect(input).toBeDisabled();

		const button = screen.getByRole("button", { name: "Add post" });
		expect(button).toBeDisabled();
	});
});
