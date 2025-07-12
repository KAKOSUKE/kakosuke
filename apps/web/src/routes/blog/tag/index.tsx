import { createFileRoute } from "@tanstack/react-router";

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
	return <div>Hello "/blog/tag/"!</div>;
}
