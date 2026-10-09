import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { PostFeed } from "../components/post-feed";

describe("PostFeed", () => {
	test("renders empty message when no posts exist", () => {
		render(<PostFeed posts={[]} />);
		expect(screen.getByText("No posts yet.")).toBeInTheDocument();
	});

	test("renders list of posts", () => {
		render(
			<PostFeed
				posts={[
					{ id: 1, name: "Post 1", authorId: null, createdAt: new Date() },
					{ id: 2, name: "Post 2", authorId: null, createdAt: new Date() },
				]}
			/>,
		);

		expect(screen.getByText("Post 1")).toBeInTheDocument();
		expect(screen.getByText("Post 2")).toBeInTheDocument();
	});
});
