import { createFileRoute } from "@tanstack/react-router";
import ChartMaker from "@/components/mermaid";

export const Route = createFileRoute("/tools/chart-maker")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				name: "description",
				content: "Chart Maker - Create and visualize your charts easily.",
			},
			{
				title: "Chart Maker",
			},
		],
	}),
});

function RouteComponent() {
	return (
		<div className="container mx-auto h-screen overflow-hidden px-4 py-2">
			<h2 className="mb-6 font-bold text-3xl">Chart Maker</h2>
			<ChartMaker />
		</div>
	);
}
