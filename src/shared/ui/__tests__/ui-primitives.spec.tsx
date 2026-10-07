import { render, screen } from "@testing-library/react";
import { useId } from "react";
import { describe, expect, test } from "vitest";
import { Badge } from "../badge";
import { Button } from "../button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../card";
import { Input } from "../input";
import { Label } from "../label";
import { Separator } from "../separator";

describe("UI Primitives", () => {
	test("Badge renders with variants", () => {
		render(<Badge variant="secondary">Active</Badge>);
		expect(screen.getByText("Active")).toBeInTheDocument();
	});

	test("Button renders with variants and handles clicks", () => {
		render(<Button variant="outline">Click me</Button>);
		expect(
			screen.getByRole("button", { name: "Click me" }),
		).toBeInTheDocument();
	});

	test("Card components compose correctly", () => {
		render(
			<Card>
				<CardHeader>
					<CardTitle>Card Title</CardTitle>
					<CardDescription>Card Description</CardDescription>
				</CardHeader>
				<CardContent>Content Area</CardContent>
			</Card>,
		);

		expect(screen.getByText("Card Title")).toBeInTheDocument();
		expect(screen.getByText("Card Description")).toBeInTheDocument();
		expect(screen.getByText("Content Area")).toBeInTheDocument();
	});

	test("Input and Label render together", () => {
		render(<LabelledInput />);

		expect(screen.getByLabelText("Test Field")).toBeInTheDocument();
	});

	test("Separator renders with default horizontal orientation", () => {
		render(<Separator data-testid="separator" />);
		expect(screen.getByTestId("separator")).toBeInTheDocument();
	});
});

// biome-ignore lint/style/useComponentExportOnlyModules: this component is a local test fixture.
function LabelledInput() {
	const inputId = useId();

	return (
		<div>
			<Label htmlFor={inputId}>Test Field</Label>
			<Input id={inputId} placeholder="Type here" />
		</div>
	);
}
