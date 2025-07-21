import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";

const TOOLS = [
	{
		name: "Chart Maker",
		slug: "chart-maker",
		description:
			"Chart Maker は、Mermaid.js を使用して、簡単にチャートを作成できるアプリケーションです。",
	},
	{
		name: "Simple QR Code Generator",
		slug: "simple-qrcode",
		description:
			"Simple QR Code Generator は、簡単にQRコードを生成できるアプリケーションです。",
	},
];

export const Route = createFileRoute("/tools/")({
	component: HomeComponent,
	head: () => ({
		meta: [
			{
				name: "description",
				content: "KAKOSUKE is a KAKOSUKE web application",
			},
			{
				title: "KAKOSUKE",
			},
		],
	}),
});

function HomeComponent() {
	const _healthCheck = useQuery(trpc.healthCheck.queryOptions());

	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<div className="grid gap-6">
				<section>
					<h2 className="mb-6 font-bold text-3xl">Production</h2>
					<div className="grid grid-cols-2 gap-4">
						{TOOLS.map((tool) => (
							// biome-ignore lint/style/useTemplate: <explanation>
							<Link key={tool.slug} to={"/tools/" + `${tool.slug}`}>
								<div className="rounded-lg border p-4">
									<h3 className="font-semibold">{tool.name}</h3>
									<p className="text-muted-foreground text-sm">
										{tool.description}
									</p>
								</div>
							</Link>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
