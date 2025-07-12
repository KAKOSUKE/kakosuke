import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface Tag {
	slug: string;
	name: string;
}

const fetchTags = async (): Promise<Tag[]> => {
	try {
		const response = await fetch("/tags.json");
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return (await response.json()) as Tag[];
	} catch (error) {
		console.error("Failed to fetch tags:", error);
		return [];
	}
};

export default function TagCloud() {
	const [tags, setTags] = useState<Tag[]>([]);

	useEffect(() => {
		async function loadTags() {
			const fetchedTags = await fetchTags();
			setTags(fetchedTags);
		}
		loadTags();
	}, []);

	if (tags.length === 0) {
		return <div>No tags available</div>;
	}
	return (
		<div className="tag-cloud">
			<h2>Tags</h2>
			<ul className="flex flex-wrap gap-2">
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
	);
}
