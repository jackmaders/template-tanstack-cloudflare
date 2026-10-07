import { type Post, PostCard } from "@/entities/post";

export function PostFeed({ posts }: { posts: Post[] }) {
	if (posts.length === 0) {
		return <p className="text-muted-foreground text-sm">No posts yet.</p>;
	}

	return (
		<ul className="divide-y">
			{posts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</ul>
	);
}
