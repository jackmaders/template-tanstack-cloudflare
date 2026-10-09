import { vi } from "vitest";

export const authClient = {
	signIn: { email: vi.fn() },
	signOut: vi.fn(),
	signUp: { email: vi.fn() },
	useSession: vi.fn(() => ({ data: null, isPending: false })),
};
