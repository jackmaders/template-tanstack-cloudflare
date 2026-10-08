import { describe, expect, test } from "vitest";
import { cn } from "../utils";

describe("cn", () => {
	test("combines multiple class names", () => {
		expect(cn("px-2", "py-1")).toBe("px-2 py-1");
	});

	test("handles conditional class names", () => {
		const getConditionalClasses = (isHidden: boolean, isVisible: boolean) =>
			cn("base", isHidden && "hidden", isVisible && "block");

		expect(getConditionalClasses(false, true)).toBe("base block");
	});
});
