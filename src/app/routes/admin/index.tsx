import { createFileRoute } from "@tanstack/react-router";
import { AdminWorkspace } from "@/widgets/admin-workspace";

export const Route = createFileRoute("/admin/")({
	component: AdminWorkspace,
});
