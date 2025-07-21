import { createFileRoute } from "@tanstack/react-router";
import QRCodeGenerator from "@/components/qrcode";

export const Route = createFileRoute("/tools/simple-qrcode")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container mx-auto px-4 py-2">
			<h2 className="mb-6 font-bold text-3xl">Simple QR Code Generator</h2>
			<QRCodeGenerator />
		</div>
	);
}
