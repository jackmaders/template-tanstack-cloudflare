import type { Post } from "../model/post-types";

export function PostCard({ post }: { post: Post }) {
	return <li className="py-2 text-sm">{post.name}</li>;
}
