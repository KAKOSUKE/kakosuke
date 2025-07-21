import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<h2 className="mb-6 font-bold text-3xl">About</h2>
			<h3 className="mb-4 text-xl">このサイトの概要</h3>
			<p>
				このサイトは、KAKOSUKEが作ったツールを公開したり、情報を共有したりするためのものです。
			</p>
			<h3 className="mt-6 mb-4 text-xl">お問い合わせ</h3>
			<p>
				ご意見やご質問がある場合は、
				<span>
					x:{" "}
					<a
						href="https://x.com/KOSUKE20505"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-500 hover:underline"
					>
						@KOSUKE20505
					</a>{" "}
					までご連絡ください。
				</span>
			</p>
		</div>
	);
}
