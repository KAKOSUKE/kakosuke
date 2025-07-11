import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface BlogPost {
	slug: string;
	title: string;
	tags?: string[];
	description?: string;
}

export const Route = createFileRoute("/blog/tag/$name")({
	component: RouteComponent,
});

function RouteComponent() {
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [tagTitle, setTagTitle] = useState<string | null>(null);
	const tag = Route.useParams().name;

	useEffect(() => {
		async function fetchPosts() {
			try {
				const response = await fetch("/posts.json");
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data: BlogPost[] = await response.json();
				// Filter posts by tag if provided
				const filteredPosts = tag
					? data.filter((post) => post.tags?.includes(tag))
					: data;

				setPosts(filteredPosts);

				const tagsResponse = await fetch("/tags.json");
				const tags = await tagsResponse.json();
				const tagTitle = tags.find(
					(t: { slug: string }) => t.slug === tag,
				)?.title;
				setTagTitle(tagTitle || null);
			} catch (error) {
				console.error("Failed to fetch blog posts:", error);
			}
		}
		fetchPosts();
	}, [tag]);

	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<h1 className="mb-6 font-bold text-3xl">
				{tagTitle ? `Posts tagged with "${tagTitle}"` : "Blog Posts"}
			</h1>
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
