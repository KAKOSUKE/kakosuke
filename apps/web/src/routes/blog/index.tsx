import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface BlogPost {
	slug: string;
	title: string;
	description?: string;
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
				setPosts(data);
			} catch (error) {
				console.error("Failed to fetch blog posts:", error);
			}
		}
		fetchPosts();
	}, []);

	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<h1 className="mb-6 font-bold text-3xl">Blog Posts</h1>
			<ul className="space-y-4">
				{posts.map((post) => (
					<li key={post.slug} className="rounded-lg border p-4">
						<Link
							to="/blog/$slug"
							params={{ slug: post.slug }}
							className="font-semibold text-blue-600 text-xl "
						>
							<div className="font-semibold text-lg">{post.title}</div>
							<div className="mt-2 text-gray-600 text-sm">
								{post.description}
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
