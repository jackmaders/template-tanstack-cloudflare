export function PostFeed({ posts }: { posts: unknown[] }) {
	return <div data-testid="mock-post-feed">{posts.length} posts</div>;
}
