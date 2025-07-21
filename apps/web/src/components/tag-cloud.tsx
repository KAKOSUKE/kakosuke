import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import TagParts from "./tag-parts";

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
						<Link to={"/blog/tag/$name"} params={{ name: tag.slug }}>
							<TagParts name={tag.name} />
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
