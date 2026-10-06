import { cn as cx } from "cn";

export function cn(...inputs: Parameters<typeof cx>): string {
	return cx(...inputs);
}
