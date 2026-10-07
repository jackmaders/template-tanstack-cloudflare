import { Link } from "@tanstack/react-router";

export function NotFoundPage() {
	return (
		<div>
			<h1>404 — Page not found</h1>
			<p>That route could not be found.</p>
			<Link to="/">Return home</Link>
		</div>
	);
}
