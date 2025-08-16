import { createFileRoute } from "@tanstack/react-router";
import { FlashcardSW } from "@/components/flashcard-sw";

export const Route = createFileRoute("/tools/flashcard-sw-person")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container mx-auto px-4 py-2">
			<h2 className="mb-6 font-bold text-3xl">
				社会福祉士 精神保健福祉士 共通科目 人物名 暗記カード
			</h2>
			<FlashcardSW />
		</div>
	);
}
