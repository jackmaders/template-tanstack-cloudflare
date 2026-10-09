import React from "react";

export function PostFeed({ posts }: { posts: unknown[] }) {
	return React.createElement(
		"div",
		{ "data-testid": "mock-post-feed" },
		`${posts.length} posts`,
	);
}
