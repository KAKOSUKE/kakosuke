import { createFileRoute } from "@tanstack/react-router";
import ChartMaker from "@/components/mermaid";

export const Route = createFileRoute("/tools/chart-maker")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container mx-auto overflow-x-hidden px-4 py-2">
			<h2 className="mb-6 font-bold text-3xl">Chart Maker</h2>
			<ChartMaker />
		</div>
	);
}
