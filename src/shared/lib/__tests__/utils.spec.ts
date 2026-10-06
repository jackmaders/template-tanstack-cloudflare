import { describe, expect, test } from "vitest";
import { cn } from "../utils";

describe("cn", () => {
	test("combines multiple class names", () => {
		expect(cn("px-2", "py-1")).toBe("px-2 py-1");
	});

	test("handles conditional class names", () => {
		expect(cn("base", false && "hidden", true && "block")).toBe("base block");
	});
});
