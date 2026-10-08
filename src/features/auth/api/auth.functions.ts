import { createServerOnlyFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "./auth.server";

export const getSession = createServerOnlyFn(() =>
	auth.api.getSession({ headers: getRequestHeaders() }),
);
