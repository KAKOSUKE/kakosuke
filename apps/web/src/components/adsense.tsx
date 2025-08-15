import { useEffect } from "react";

declare global {
	interface Window {
		adsbygoogle: unknown[];
	}
}

interface AdsenseProps {
	format?: "auto" | "fluid" | "rectangle" | "vertical";
	responsive?: boolean;
	className?: string;
}

const Adsense = ({
	format = "auto",
	responsive = true,
	className = "",
}: AdsenseProps) => {
	useEffect(() => {
		try {
			if (!window.adsbygoogle) {
				window.adsbygoogle = [];
			}
			window.adsbygoogle.push({});
		} catch (err) {
			console.error("AdSense script error:", err);
		}
	}, []);

	if (import.meta.env.MODE !== "production") {
		return (
			<div className="my-4 rounded bg-gray-200 p-4 text-center dark:bg-gray-700">
				広告ユニット (開発環境プレースホルダー)
			</div>
		);
	}

	return (
		<div className={className}>
			<ins
				className="adsbygoogle"
				style={{ display: "block" }}
				data-ad-slot="7939280679q"
				data-ad-format={format}
				data-full-width-responsive={responsive.toString()}
			/>
		</div>
	);
};

export default Adsense;
