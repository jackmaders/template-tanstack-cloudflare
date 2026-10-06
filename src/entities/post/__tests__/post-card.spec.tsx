import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { PostCard } from "../ui/post-card";

describe("PostCard", () => {
	test("renders post name", () => {
		render(
			<PostCard post={{ id: 1, name: "Sample Post", createdAt: new Date() }} />,
		);

		expect(screen.getByText("Sample Post")).toBeInTheDocument();
	});
});
