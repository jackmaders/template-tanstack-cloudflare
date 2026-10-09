import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
	component: AdminPage,
});

function AdminPage() {
	return (
		<main className="mx-auto max-w-2xl space-y-2 p-6">
			<h1 className="font-semibold text-2xl">Admin Dashboard</h1>
			<p className="text-muted-foreground">
				Protected route demonstrating role-based access control with Better Auth
				and TanStack Router.
			</p>
		</main>
	);
}
