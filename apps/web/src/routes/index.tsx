import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/")({
	component: HomeComponent,
	head: () => ({
		meta: [
			{
				name: "description",
				content: "My App is a web application",
			},
			{
				title: "My App",
			},
		],
	}),
});

const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 `;

function HomeComponent() {
	const healthCheck = useQuery(trpc.healthCheck.queryOptions());

	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
			<div className="grid gap-6">
				<section className="rounded-lg border p-4">
					<h2 className="mb-2 font-medium">API Status</h2>
					<div className="flex items-center gap-2">
						<div
							className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
						/>
						<span className="text-muted-foreground text-sm">
							{healthCheck.isLoading
								? "Checking..."
								: healthCheck.data
									? "Connected"
									: "Disconnected"}
						</span>
					</div>
				</section>
				<section>
					<h2 className="mb-2 font-medium">Production</h2>
					<div className="grid grid-cols-2 gap-4">
						<div className="rounded-lg border p-4">
							<a
								href="https://chart-maker.kosuke0505.com/"
								target="_blank"
								rel="noopener noreferrer"
							>
								<h3>Chart Maker（チャートメーカー）</h3>
								<p className="text-muted-foreground text-sm">
									Chart Maker は、Mermaid.js
									を使用して、簡単にチャートを作成できるアプリケーションです。
								</p>
							</a>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
