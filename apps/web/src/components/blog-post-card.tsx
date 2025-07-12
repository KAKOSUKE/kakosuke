import { Link } from "@tanstack/react-router";

export default function BlogPostCard({
	slug,
	title,
	description,
}: {
	slug: string;
	title: string;
	description: string;
}) {
	return (
		<Link
			to="/blog/$slug"
			params={{ slug }}
			className="font-semibold text-blue-600 text-xl"
		>
			<div className="font-semibold text-lg">{title}</div>
			{/* 32文字以内で要約 */}
			<div className="mt-2 overflow-hidden overflow-ellipsis text-gray-600 text-sm dark:text-gray-400">
				{description}
			</div>
		</Link>
	);
}
