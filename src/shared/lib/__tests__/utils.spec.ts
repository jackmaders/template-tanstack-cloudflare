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

	test("resolves conflicting Tailwind utility classes in favour of overrides", () => {
		expect(cn("p-2", "p-4")).toBe("p-4");
		expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
	});
});
