import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

export const Route = createFileRoute("/blog/$slug")({
	loader: async ({ params }) => {
		const { slug } = params;

		try {
			// public/posts.json
			const response = await fetch("/posts.json");
			const posts = await response.json();
			const post = posts.find((p: { slug: string }) => p.slug === slug);

			if (!post) {
				throw new Error(`Post not found for slug: ${slug}`);
			}

			// /tags.json
			const tagsResponse = await fetch("/tags.json");
			const tags = await tagsResponse.json();
			const postTags = post.tags
				? post.tags
						.map((tag: string) => {
							const foundTag = tags.find(
								(t: { slug: string }) => t.slug === tag,
							);
							return foundTag
								? { slug: foundTag.slug, title: foundTag.title }
								: null;
						})
						.filter(Boolean)
				: [];

			return {
				title: post.title as string,
				description: post.description as string,
				tags: postTags,
			};
		} catch (error) {
			console.error("Error fetching post:", error);
			throw new Error("Failed to load blog post.");
		}
	},
	component: BlogPost,
	head: ({ loaderData }) => ({
		title: loaderData?.title || "Blog Post",
		meta: [
			{
				name: "description",
				content: loaderData?.description || "A blog post",
			},
		],
	}),
});

function BlogPost() {
	const { slug } = Route.useParams();
	const tags = Route.useLoaderData()?.tags || [];
	const [markdown, setMarkdown] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchMarkdown() {
			try {
				const response = await fetch(`/posts/${slug}.md`);
				if (!response.ok) {
					throw new Error(`Failed to load post: ${response.statusText}`);
				}
				const text = await response.text();
				setMarkdown(text);
			} catch (err) {
				console.error("Error fetching markdown:", err);
				setError("Failed to load blog post. Please try again later.");
			}
		}
		fetchMarkdown();
	}, [slug]);

	if (error) {
		return (
			<div className="container mx-auto max-w-3xl px-4 py-2">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	if (!markdown) {
		return (
			<div className="container mx-auto max-w-3xl px-4 py-2">
				<p>Loading...</p>
			</div>
		);
	}

	return (
		<div className="prose dark:prose-invert container mx-auto max-w-3xl px-4 py-2">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					code: function CodeComponent({
						inline,
						className,
						children,
					}: React.ComponentProps<"code"> & { inline?: boolean }) {
						const match = /language-(\w+)/.exec(className || "");
						return !inline && match ? (
							<SyntaxHighlighter
								style={dracula}
								language={match[1]}
								PreTag="div"
							>
								{String(children).replace(/\n$/, "")}
							</SyntaxHighlighter>
						) : (
							<code className={className}>{children}</code>
						);
					},
				}}
			>
				{markdown}
			</ReactMarkdown>

			<hr className="my-6" />

			{tags.length > 0 && (
				<div className="mt-4">
					<ul className="flex flex-wrap gap-2">
						{" "}
						{tags.map((tag: { slug: string; title: string }) => (
							<li key={tag.slug}>
								<Link
									to={"/blog/tag/$name"}
									params={{ name: tag.slug }}
									className="inline-block rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800 text-sm transition-colors duration-200 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700"
								>
									{tag.title}
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
