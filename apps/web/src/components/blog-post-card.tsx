import { Link } from "@tanstack/react-router";

export default function BlogPostCard({
	slug,
	title,
	description,
	date,
}: {
	slug: string;
	title: string;
	description: string;
	date: string;
}) {
	return (
		<Link
			to="/blog/$slug"
			params={{ slug }}
			className="font-semibold text-blue-600 text-xl"
		>
			<div className="font-semibold text-lg">{title}</div>
			<div className="mt-1 text-gray-500 text-xs">
				{new Date(date).toLocaleDateString("ja-JP", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				})}
			</div>
			<div className="mt-2 overflow-hidden overflow-ellipsis text-gray-600 text-sm dark:text-gray-400">
				{description}
			</div>
		</Link>
	);
}
