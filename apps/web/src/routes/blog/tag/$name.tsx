import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import BlogPostCard from "@/components/blog-post-card";
import { sortByDate } from "@/utils/blog-utils";

interface BlogPost {
	slug: string;
	title: string;
	description?: string;
	date: string;
	tags?: string[];
}

interface Tag {
	slug: string;
	name: string;
}

export const Route = createFileRoute("/blog/tag/$name")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const { name } = params;

		try {
			const tagsResponse = await fetch("/tags.json");
			const tags = (await tagsResponse.json()) as Tag[];
			const tagName = tags.find((t) => t.slug === name);
			if (!tagName) {
				throw new Error(`Tag not found for name: ${name}`);
			}

			return {
				name: tagName.name as string,
			};
		} catch (error) {
			console.error("Error fetching tag:", error);
			throw new Error("Failed to load blog posts by tag.");
		}
	},
	head: ({ loaderData }) => ({
		meta: [
			{
				name: "description",
				content: `Explore blog posts tagged with "${loaderData?.name}".`,
			},
			{
				title: `Posts tagged with "${loaderData?.name}"`,
			},
		],
	}),
});

function RouteComponent() {
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const tagTitle = Route.useLoaderData()?.name;
	const tag = Route.useParams().name;

	useEffect(() => {
		async function fetchPosts() {
			try {
				const response = await fetch("/posts.json");
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data: BlogPost[] = await response.json();
				const filteredPosts = tag
					? data.filter((post) => post.tags?.includes(tag))
					: data;
				const sortedPosts = sortByDate(filteredPosts);

				setPosts(sortedPosts);
			} catch (error) {
				console.error("Failed to fetch blog posts:", error);
			}
		}
		fetchPosts();
	}, [tag]);

	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<h2 className="mb-6 font-bold text-3xl">
				{tagTitle ? `Posts tagged with "${tagTitle}"` : "Blog Posts"}
			</h2>
			<ul className="space-y-4">
				{posts.map((post) => (
					<li key={post.slug} className="rounded-lg border p-4">
						<BlogPostCard
							slug={post.slug}
							title={post.title}
							description={post.description || "No description available."}
							date={new Date().toLocaleDateString()} // Placeholder for date
							tags={post.tags || []}
						/>
					</li>
				))}
			</ul>
		</div>
	);
}
