import { useSuspenseQuery } from "@tanstack/react-query";
import { postListQueryOptions } from "@/entities/post";
import { PostCreateForm } from "@/features/post-create/index.async";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { PostFeed } from "@/widgets/post-feed";

export function HomePage() {
	const { data: posts } = useSuspenseQuery(postListQueryOptions);

	return (
		<main className="mx-auto max-w-2xl space-y-8 p-6">
			<header className="space-y-2">
				<h1 className="text-2xl font-semibold">Build fast on the edge.</h1>
				<p className="text-muted-foreground">
					TanStack Start + Cloudflare starter template.
				</p>
			</header>

			<section className="space-y-2">
				<h2 className="font-medium">Included</h2>
				<ul className="list-inside list-disc space-y-1 text-sm">
					<li>Cloudflare D1</li>
					<li>Better Auth</li>
					<li>Drizzle ORM</li>
					<li>shadcn/ui</li>
				</ul>
			</section>

			<Card>
				<CardHeader>
					<CardTitle>Posts</CardTitle>
					<CardDescription>
						An example feature with a form, server function, and database query.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<PostCreateForm />
					<Separator />
					<section className="space-y-2">
						<h2 className="font-medium text-sm">
							Recent posts{" "}
							<span className="text-muted-foreground">({posts.length})</span>
						</h2>
						<PostFeed posts={posts} />
					</section>
				</CardContent>
			</Card>
		</main>
	);
}
