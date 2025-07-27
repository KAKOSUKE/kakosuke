import { markdown } from "@codemirror/lang-markdown";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import type { MermaidConfig } from "mermaid";
import mermaid from "mermaid";
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = useState(false);
	useEffect(() => {
		const media = window.matchMedia(query);
		if (media.matches !== matches) setMatches(media.matches);
		const listener = () => setMatches(media.matches);
		window.addEventListener("resize", listener);
		return () => window.removeEventListener("resize", listener);
	}, [matches, query]);
	return matches;
};

interface MermaidDiagramHandle {
	downloadAsSVG: () => void;
	downloadAsPNG: () => void;
}

interface MermaidDiagramProps {
	code: string;
	fontSize: number;
	theme: MermaidConfig["theme"];
	themeVariables?: MermaidConfig["themeVariables"];
}

const MermaidDiagram = forwardRef<MermaidDiagramHandle, MermaidDiagramProps>(
	({ code, fontSize, theme, themeVariables }, ref) => {
		const containerRef = useRef<HTMLDivElement>(null);

		useImperativeHandle(ref, () => ({
			downloadAsSVG() {
				const svgElement = containerRef.current?.querySelector("svg");
				if (!svgElement) {
					alert("ダウンロードする図がありません。");
					return;
				}
				const svgData = new XMLSerializer().serializeToString(svgElement);
				const blob = new Blob([svgData], { type: "image/svg+xml" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = "diagram.svg";
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			},

			downloadAsPNG() {
				const svgElement = containerRef.current?.querySelector("svg");
				if (!svgElement) {
					alert("ダウンロードする図がありません。");
					return;
				}
				const svgData = new XMLSerializer().serializeToString(svgElement);

				const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;

				const img = new Image();

				img.onload = () => {
					const canvas = document.createElement("canvas");
					const scale = 2;
					canvas.width = img.width * scale;
					canvas.height = img.height * scale;

					const ctx = canvas.getContext("2d");
					if (!ctx) {
						alert("描画コンテキストの取得に失敗しました。");
						return;
					}

					ctx.fillStyle = "white";
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

					const pngUrl = canvas.toDataURL("image/png");
					const a = document.createElement("a");
					a.href = pngUrl;
					a.download = "diagram.png";
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
				};

				img.onerror = () => {
					alert(
						"画像の読み込み中にエラーが発生しました。コンソールをご確認ください。",
					);
				};

				img.src = dataUrl;
			},
		}));

		useEffect(() => {
			const renderDiagram = async () => {
				if (!containerRef.current) return;
				if (code.trim() === "") {
					containerRef.current.innerHTML = "";
					return;
				}

				const initConfig: MermaidConfig = {
					theme: theme,
					themeVariables: {
						...themeVariables,
						fontSize: `${fontSize}px`,
						lineHeight: "1.4", // 前回の修正を反映
					},
				};
				const fullCode = `%%{init: ${JSON.stringify(initConfig)}}%%\n${code}`;

				try {
					// 1. 描画の前に構文を検証
					await mermaid.parse(fullCode);

					// 2. 検証が成功したら、図を描画
					const svgId = `mermaid-svg-${Date.now()}`;
					const { svg } = await mermaid.render(svgId, fullCode);

					// 正常なSVGをコンテナにセット
					if (containerRef.current) {
						containerRef.current.innerHTML = "";
						const parser = new DOMParser();
						const sanitizedSvg = svg.replace(/<br>/g, "<br/>");
						const svgDoc = parser.parseFromString(
							sanitizedSvg,
							"image/svg+xml",
						);

						if (
							svgDoc.firstChild &&
							svgDoc.getElementsByTagName("parsererror").length === 0
						) {
							containerRef.current.appendChild(svgDoc.firstChild);
						} else {
							containerRef.current.innerHTML = `<div class="p-4 text-red-500 font-bold">SVGのパースに失敗しました。</div>`;
							console.error(
								"SVG Parse Error:",
								svgDoc.getElementsByTagName("parsererror")[0]?.textContent,
							);
						}
					}
				} catch (error) {
					// 3. 構文エラーをキャッチしたら、カスタムエラーメッセージを表示
					if (containerRef.current) {
						containerRef.current.innerHTML = `<div class="p-4 text-red-500 font-bold">エラー：構文が正しくありません。</div>`;
					}
					// 開発者向けにコンソールにはエラー情報を残す
					console.error("Mermaid Parse Error:", error);
				}
			};

			renderDiagram();
		}, [code, fontSize, theme, themeVariables]);

		return <div ref={containerRef} />;
	},
);

export default function ChartMaker() {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const diagramRef = useRef<MermaidDiagramHandle>(null);

	const [code, setCode] = useState<string>(`graph TD
    A[全ての機能が復活！] --> B(モーダル表示OK);
    A --> C(フォントサイズ変更OK);
  `);

	const [minHeightInPercentage, setMinHeightInPercentage] = useState(20);

	useEffect(() => {
		const calculateMinHeight = () => {
			const percentage = (480 / window.innerHeight) * 100;
			setMinHeightInPercentage(Math.min(90, percentage));
		};

		calculateMinHeight();

		window.addEventListener("resize", calculateMinHeight);
		return () => window.removeEventListener("resize", calculateMinHeight);
	}, []);

	const [fontSize, setFontSize] = useState<number>(16);
	const handleCodeChange = (value: string) => setCode(value);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const [selectedTheme, setSelectedTheme] =
		useState<MermaidConfig["theme"]>("default");
	const [customThemeVariables, setCustomThemeVariables] = useState<string>("");
	const [themeVariables, setThemeVariables] = useState<
		MermaidConfig["themeVariables"] | undefined
	>(undefined);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);
	const applyStyles = () => {
		closeModal();
		try {
			const parsedVariables = customThemeVariables
				? JSON.parse(customThemeVariables)
				: undefined;
			setThemeVariables(parsedVariables);
		} catch (_e) {
			alert("詳細設定のJSON形式が正しくありません。");
		}
	};

	return (
		<div className="flex h-[90vh] min-h-[480px] flex-col overflow-x-hidden rounded-lg border">
			<PanelGroup
				direction={isDesktop ? "horizontal" : "vertical"}
				className="flex h-full"
			>
				<Panel defaultSize={50} minSize={20}>
					<div className="flex h-full flex-col bg-gray-900 p-4">
						<h2 className="mb-2 font-bold text-lg text-white">Mermaid Code</h2>
						<div className="min-h-0 flex-1 overflow-auto">
							<CodeMirror
								value={code}
								height="100%"
								theme={vscodeDark}
								extensions={[markdown()]}
								onChange={handleCodeChange}
								className="h-full"
							/>
						</div>
					</div>
				</Panel>

				<PanelResizeHandle
					className={`bg-gray-200 transition-colors hover:bg-blue-500 ${isDesktop ? "w-2" : "h-2"}`}
				/>

				<Panel
					defaultSize={50}
					minSize={isDesktop ? 20 : minHeightInPercentage}
				>
					<div className="flex h-full flex-col p-4 dark:bg-accent-dark">
						<h2 className="mb-2 flex items-center justify-between font-bold text-lg">
							Preview
							<button
								type="button"
								onClick={openModal}
								className="rounded bg-blue-500 px-3 py-1 font-semibold text-sm text-white hover:cursor-pointer hover:bg-blue-700 dark:bg-blue-900 dark:hover:bg-blue-800"
							>
								スタイル設定
							</button>
						</h2>
						<TransformWrapper
							key={isDesktop ? "desktop" : "mobile"}
							minScale={0.25}
							initialScale={1}
							limitToBounds={false}
						>
							{({ resetTransform }) => (
								<React.Fragment>
									<div className="mb-4 space-y-3 rounded-md border bg-white p-3 dark:bg-gray-800">
										<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
											<label
												htmlFor="font-size-slider"
												className="w-1/4 font-medium text-sm"
											>
												フォントサイズ
											</label>
											<div className="flex min-w-[150px] flex-1 items-center gap-2">
												<input
													id="font-size-slider"
													type="range"
													min="10"
													max="24"
													value={fontSize}
													onChange={(e) => setFontSize(Number(e.target.value))}
													className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
												/>
												<span className="w-10 flex-shrink-0 text-right text-sm">
													{fontSize}px
												</span>
											</div>
										</div>
										<div className="flex items-center gap-4">
											<span className="w-1/4 font-medium text-sm">表示</span>
											<button
												type="button"
												onClick={() => resetTransform()}
												className="rounded bg-gray-200 px-3 py-1 font-semibold text-gray-700 text-sm hover:bg-gray-300"
											>
												リセット
											</button>
										</div>
									</div>
									<div className="mb-4 space-y-3 rounded-md border bg-white p-3 dark:bg-gray-800">
										<div className="flex flex-wrap items-center gap-4">
											<span className="w-1/4 font-medium text-sm">
												画像出力
											</span>
											<div className="flex gap-2">
												<button
													type="button"
													onClick={() => diagramRef.current?.downloadAsSVG()}
													className="rounded bg-gray-200 px-3 py-1 font-semibold text-gray-700 text-sm hover:bg-gray-300"
												>
													SVGで保存
												</button>
												<button
													type="button"
													onClick={() => diagramRef.current?.downloadAsPNG()}
													className="rounded bg-gray-200 px-3 py-1 font-semibold text-gray-700 text-sm hover:bg-gray-300"
												>
													PNGで保存
												</button>
											</div>
										</div>
									</div>
									<div className="min-h-0 flex-1 cursor-grab overflow-hidden rounded-md border border-gray-200 bg-gray-50">
										<TransformComponent
											wrapperClass="!w-full !h-full"
											contentClass="w-full h-full flex items-center justify-center"
										>
											<MermaidDiagram
												ref={diagramRef}
												code={code}
												fontSize={fontSize}
												theme={selectedTheme}
												themeVariables={themeVariables}
											/>
										</TransformComponent>
									</div>
								</React.Fragment>
							)}
						</TransformWrapper>
					</div>
				</Panel>
			</PanelGroup>

			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="relative w-full max-w-md rounded-md bg-white p-6 shadow-lg">
						<h2 className="mb-4 font-bold text-black text-lg">スタイル設定</h2>
						<div className="mb-4">
							<label
								htmlFor="theme-select"
								className="mb-2 block font-bold text-gray-700 text-sm"
							>
								テーマ
							</label>
							<select
								id="theme-select"
								className="w-full appearance-none rounded border px-3 py-2 text-gray-700 leading-tight shadow focus:shadow-outline focus:outline-none"
								value={selectedTheme}
								onChange={(e) =>
									setSelectedTheme(e.target.value as MermaidConfig["theme"])
								}
							>
								<option value="default">default</option>
								<option value="dark">dark</option>
								<option value="forest">forest</option>
								<option value="neutral">neutral</option>
								<option value="base">base</option>
							</select>
						</div>
						<div className="mb-4">
							<label
								htmlFor="theme-variables"
								className="mb-2 block font-bold text-gray-700 text-sm"
							>
								詳細設定 (JSON形式)
							</label>
							<textarea
								id="theme-variables"
								className="h-40 w-full appearance-none rounded border px-3 py-2 text-gray-700 leading-tight shadow focus:shadow-outline focus:outline-none"
								value={customThemeVariables}
								onChange={(e) => setCustomThemeVariables(e.target.value)}
								placeholder='例: {"primaryColor": "#ccf", "nodeBorder": "#99f"}'
							/>
						</div>
						<div className="flex justify-end">
							<button
								type="button"
								onClick={closeModal}
								className="mr-2 rounded bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400 focus:shadow-outline focus:outline-none"
							>
								キャンセル
							</button>
							<button
								type="button"
								onClick={applyStyles}
								className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:shadow-outline focus:outline-none"
							>
								適用
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
