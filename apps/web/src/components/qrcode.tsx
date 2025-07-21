import { QRCodeSVG } from "qrcode.react";
import type React from "react";
import { useRef, useState } from "react";

const QRCodeGenerator: React.FC = () => {
	const [text, setText] = useState<string>("https://google.com/");
	const [size, setSize] = useState<number>(256);

	const qrRef = useRef<HTMLDivElement>(null);

	const handleSaveAsSVG = (): void => {
		const svgElement = qrRef.current?.querySelector("svg");
		if (!svgElement) {
			console.error("SVG要素が見つかりませんでした。");
			return;
		}

		const serializer = new XMLSerializer();
		const svgString = serializer.serializeToString(svgElement);
		const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "qrcode.svg";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const handleSaveAsPNG = (): void => {
		const svgElement = qrRef.current?.querySelector("svg");
		if (!svgElement) {
			console.error("SVG要素が見つかりませんでした。");
			return;
		}

		const serializer = new XMLSerializer();
		const svgString = serializer.serializeToString(svgElement);
		const svgBlob = new Blob([svgString], {
			type: "image/svg+xml;charset=utf-8",
		});
		const url = URL.createObjectURL(svgBlob);

		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			const scale = 2;
			canvas.width = svgElement.width.baseVal.value * scale;
			canvas.height = svgElement.height.baseVal.value * scale;

			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

			const pngUrl = canvas.toDataURL("image/png");

			const link = document.createElement("a");
			link.href = pngUrl;
			link.download = "qrcode.png";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		};
		img.src = url;
	};

	return (
		<div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6 font-sans shadow-lg">
			<div
				ref={qrRef}
				className="mx-auto my-6 aspect-square w-full max-w-xs rounded-md border border-gray-300 bg-white p-4 shadow"
			>
				<QRCodeSVG
					value={text}
					size={size}
					marginSize={4}
					style={{ width: "100%", height: "auto" }}
				/>
			</div>

			<div className="flex flex-col gap-5">
				<div>
					<label
						htmlFor="qr-text"
						className="mb-2 block font-medium text-gray-700"
					>
						QRコードにするテキスト:
					</label>
					<input
						id="qr-text"
						type="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						className="w-full rounded-lg border border-gray-300 p-2.5 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div>
					<div className="mb-2 flex items-center justify-between">
						<label
							htmlFor="qr-size-input"
							className="font-medium text-gray-700"
						>
							サイズ (px):
						</label>
						<input
							id="qr-size-input"
							type="number"
							min="64"
							max="512"
							value={size}
							onChange={(e) => setSize(Number(e.target.value))}
							className="w-24 rounded-lg border border-gray-300 p-2 text-center transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<input
						type="range"
						aria-label="サイズスライダー"
						min="64"
						max="512"
						value={size}
						onChange={(e) => setSize(Number(e.target.value))}
						className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-500"
					/>
				</div>
				<div className="mt-4 flex flex-col gap-4 sm:flex-row">
					<button
						type="button"
						onClick={handleSaveAsSVG}
						className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
					>
						SVGで保存 🖼️
					</button>
					<button
						type="button"
						onClick={handleSaveAsPNG}
						className="flex-1 rounded-lg bg-teal-500 px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75"
					>
						PNGで保存 💾
					</button>
				</div>
			</div>
		</div>
	);
};

export default QRCodeGenerator;
