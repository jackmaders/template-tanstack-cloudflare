import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ensureAdminAccessServerFn } from "@/features/auth/api/admin.functions";

export const Route = createFileRoute("/admin")({
	beforeLoad: () => ensureAdminAccessServerFn(),
	component: Outlet,
});
