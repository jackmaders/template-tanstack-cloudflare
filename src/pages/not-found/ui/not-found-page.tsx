import { Link } from "@tanstack/react-router";
import { Button } from "@/shared/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui/card";

export function NotFoundPage() {
	return (
		<main className="mx-auto max-w-lg p-6">
			<Card>
				<CardHeader>
					<CardTitle>Page not found</CardTitle>
					<CardDescription>That route could not be found.</CardDescription>
				</CardHeader>
				<CardContent>
					<Button render={<Link to="/" />}>Return home</Button>
				</CardContent>
			</Card>
		</main>
	);
}
