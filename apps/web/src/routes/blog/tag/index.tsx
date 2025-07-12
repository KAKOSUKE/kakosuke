import { createFileRoute } from "@tanstack/react-router";
import TagCloud from "@/components/tag-cloud";

export const Route = createFileRoute("/blog/tag/")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				name: "description",
				content: "Explore blog posts by tags.",
			},
			{
				title: "Blog Tags",
			},
		],
	}),
});

function RouteComponent() {
	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<h2 className="mb-6 font-bold text-3xl">Blog Tags</h2>
			<TagCloud />
		</div>
	);
}
