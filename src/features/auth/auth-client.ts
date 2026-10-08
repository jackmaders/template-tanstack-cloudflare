import { createAuthClient } from "better-auth/react";

const baseURL =
	typeof window === "undefined" ? undefined : window.location.origin;

export const authClient = createAuthClient({ baseURL });
