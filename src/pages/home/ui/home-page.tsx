import { useSuspenseQuery } from "@tanstack/react-query";
import { postListQueryOptions } from "@/entities/post";
import { PostCreateForm } from "@/features/post-create/index.async";
import { SessionPanel } from "@/features/session-manage/index.async";
import { authClient } from "@/shared/auth";
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
	const { data: session, isPending: isSessionPending } =
		authClient.useSession();
	const user = session?.user;

	return (
		<main className="mx-auto max-w-4xl space-y-8 p-6">
			<header className="space-y-2">
				<h1 className="font-semibold text-2xl">Build fast on the edge.</h1>
				<p className="text-muted-foreground">
					TanStack Start + Cloudflare starter template.
				</p>
			</header>

			<section className="grid gap-6 md:grid-cols-2">
				<div className="space-y-2">
					<h2 className="font-medium">Included</h2>
					<ul className="list-inside list-disc space-y-1 text-sm">
						<li>Cloudflare D1</li>
						<li>Better Auth</li>
						<li>Drizzle ORM</li>
						<li>shadcn/ui</li>
					</ul>
				</div>
				<SessionPanel isPending={isSessionPending} user={user} />
			</section>

			<Card>
				<CardHeader>
					<CardTitle>Posts</CardTitle>
					<CardDescription>
						An example feature with a form, server function, and database query.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<PostCreateForm
						isAuthenticated={Boolean(user)}
						isSessionPending={isSessionPending}
					/>
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
