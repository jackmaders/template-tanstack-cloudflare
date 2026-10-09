import { vi } from "vitest";

export const authMiddleware = vi.fn();
export const adminMiddleware = vi.fn();
export const authClient = {
	useSession: vi.fn(() => ({ data: null, isPending: false })),
};
