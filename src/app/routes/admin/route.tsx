import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ensureAdminAccessServerFn } from "@/shared/auth";

export const Route = createFileRoute("/admin")({
	beforeLoad: () => ensureAdminAccessServerFn(),
	component: Outlet,
});
