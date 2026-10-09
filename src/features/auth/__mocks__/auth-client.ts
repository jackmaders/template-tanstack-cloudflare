import { vi } from "vitest";

export const authClient = {
	useSession: vi.fn(() => ({ data: null, isPending: false })),
};
