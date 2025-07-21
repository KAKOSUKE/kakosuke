import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import BlogPostCard from "@/components/blog-post-card";
import TagCloud from "@/components/tag-cloud";
import { sortByDate } from "@/utils/blog-utils";

interface BlogPost {
	slug: string;
	title: string;
	description?: string;
	date: string;
	tags?: string[];
}

export const Route = createFileRoute("/blog/")({
	component: BlogIndex,
	head: () => ({
		meta: [
			{
				name: "description",
				content: "Explore our latest blog posts.",
			},
			{
				title: "Blog",
			},
		],
	}),
});

function BlogIndex() {
	const [posts, setPosts] = useState<BlogPost[]>([]);

	useEffect(() => {
		async function fetchPosts() {
			try {
				const response = await fetch("/posts.json");
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data: BlogPost[] = await response.json();
				const sortedPosts = sortByDate(data);
				setPosts(sortedPosts);
			} catch (error) {
				console.error("Failed to fetch blog posts:", error);
			}
		}
		fetchPosts();
	}, []);

	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<h2 className="mb-6 font-bold text-3xl">Blog Posts</h2>
			<ul className="space-y-4">
				{posts.map((post) => (
					<li key={post.slug} className="rounded-lg border p-4">
						<BlogPostCard
							slug={post.slug}
							title={post.title}
							description={post.description ?? ""}
							date={post.date}
						/>
					</li>
				))}
			</ul>
			<TagCloud />
		</div>
	);
}
