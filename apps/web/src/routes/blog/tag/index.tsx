import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/tag/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/blog/tag/"!</div>;
}
