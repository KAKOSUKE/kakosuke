import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface Tag {
	slug: string;
	name: string;
}

interface BlogPost {
	slug: string;
	title: string;
	description?: string;
	date: string;
	tags?: string[];
}

export const Route = createFileRoute("/blog/$slug")({
	loader: async ({ params }) => {
		const { slug } = params;

		try {
			// public/posts.json
			const response = await fetch("/posts.json");
			const posts = (await response.json()) as BlogPost[];
			const post = posts.find((p) => p.slug === slug);

			if (!post) {
				throw new Error(`Post not found for slug: ${slug}`);
			}

			// /tags.json
			const tagsResponse = await fetch("/tags.json");
			const tags = (await tagsResponse.json()) as Tag[];
			const postTags = post.tags?.map((tagSlug) =>
				tags.find((tag) => tag.slug === tagSlug),
			);

			if (!postTags) {
				throw new Error(`Tags not found for post: ${slug}`);
			}

			return {
				title: post.title as string,
				description: post.description as string,
				date: post.date as string,
				tags: postTags as { slug: string; name: string }[],
			};
		} catch (error) {
			console.error("Error fetching post:", error);
			throw new Error("Failed to load blog post.");
		}
	},
	component: BlogPost,
	head: ({ loaderData }) => ({
		meta: [
			{
				name: "description",
				content: loaderData?.description || "A blog post",
			},
			{
				title: loaderData?.title || "Blog Post",
			},
		],
	}),
});

function BlogPost() {
	const { slug } = Route.useParams();
	const tags = Route.useLoaderData().tags;
	const date = Route.useLoaderData().date;
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
		<div className="container mx-auto w-[90vw] max-w-3xl px-4 py-2">
			<div className="prose dark:prose-invert">
				<time dateTime={date} className="float-end text-gray-500 text-sm">
					{new Date(date).toLocaleDateString("ja-JP", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</time>
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					rehypePlugins={[rehypeRaw]}
					components={{
						code: function CodeComponent({
							inline,
							className,
							children,
						}: React.ComponentProps<"code"> & { inline?: boolean }) {
							const match = /language-(\w+)/.exec(className || "");
							return !inline && match ? (
								<SyntaxHighlighter
									style={a11yDark}
									language={match[1]}
									PreTag="div"
									className="code_in_pre"
								>
									{String(children).replace(/\n$/, "")}
								</SyntaxHighlighter>
							) : (
								<code className={className}>{children}</code>
							);
						},
						a: ({ href, children }) => {
							const isExternal = href && !href.startsWith("/");
							return (
								<a
									href={href}
									target={isExternal ? "_blank" : undefined}
									rel={isExternal ? "noopener noreferrer" : undefined}
								>
									{children}
								</a>
							);
						},
					}}
				>
					{markdown}
				</ReactMarkdown>
			</div>

			<hr className="my-6" />

			{tags.length > 0 && (
				<div className="mt-4">
					<ul className="flex flex-wrap gap-2">
						{" "}
						{tags.map((tag) => (
							<li key={tag.slug}>
								<Link
									to={"/blog/tag/$name"}
									params={{ name: tag.slug }}
									className="inline-block rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800 text-sm transition-colors duration-200 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700"
								>
									{tag.name}
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
