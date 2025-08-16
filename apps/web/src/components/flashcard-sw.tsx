import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { questionsSW } from "@/questions/sw";

// --- 型定義 ---

// 暗記カードのデータ構造
interface CardData {
	category: string;
	person: string;
	description: string;
	keywords: string;
}

// ゲームの状態を表す型
type GameState = "settings" | "playing" | "completed";

// 問題形式のモードを表す型
type Mode = "personToDesc" | "descToPerson" | "multipleChoice";

// 設定の状態を表す型
interface SettingsState {
	category: string;
	mode: Mode;
}

// --- データ部分 (本来は別ファイル `data.ts` に切り出すのが望ましい) ---
const data: CardData[] = questionsSW.map((q) => ({
	category: q.category,
	person: q.person,
	description: q.description,
	keywords: q.keywords,
}));

// --- ユーティリティ関数 ---
const shuffle = <T,>(array: T[]): T[] => {
	const newArray = [...array];
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
	}
	return newArray;
};

// --- 子コンポーネント ---

// Settings コンポーネントの Props 型
interface SettingsProps {
	onStart: (settings: SettingsState) => void;
}

const Settings: React.FC<SettingsProps> = ({ onStart }) => {
	const [category, setCategory] = useState<string>("all");
	const [mode, setMode] = useState<Mode>("personToDesc");

	const handleStart = () => {
		onStart({ category, mode });
	};

	return (
		<div id="controls" className="mb-6 rounded-xl bg-white p-6 shadow-md">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div>
					<label
						htmlFor="category"
						className="mb-1 block font-medium text-gray-700 text-sm"
					>
						カテゴリー
					</label>
					<select
						id="category"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
					>
						<option value="all">すべて</option>
						<option value="1">Ⅰ. ソーシャルワーク</option>
						<option value="2">Ⅱ. 心理学・発達理論</option>
						<option value="3">Ⅲ. 社会学・社会システム論</option>
						<option value="4">Ⅳ. 社会福祉の歴史（海外）</option>
						<option value="5">Ⅴ. 社会福祉の歴史（日本）</option>
						<option value="6">Ⅵ. ノーマライゼーション</option>
					</select>
				</div>
				<div>
					<label
						htmlFor="mode"
						className="mb-1 block font-medium text-gray-700 text-sm"
					>
						問題形式
					</label>
					<select
						id="mode"
						value={mode}
						onChange={(e) => setMode(e.target.value as Mode)}
						className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
					>
						<option value="personToDesc">人物名 → 説明（単語帳）</option>
						<option value="descToPerson">説明 → 人物名（単語帳）</option>
						<option value="multipleChoice">説明 → 人物名（4択クイズ）</option>
					</select>
				</div>
				<div className="flex items-end">
					<button
						type="button"
						onClick={handleStart}
						className="w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
						スタート
					</button>
				</div>
			</div>
		</div>
	);
};

// Progress コンポーネントの Props 型
interface ProgressProps {
	current: number;
	total: number;
}

const Progress: React.FC<ProgressProps> = ({ current, total }) => {
	if (total === 0) return null;
	return (
		<div className="mb-2 text-center font-medium text-gray-600">
			問題 {current + 1} / {total}
		</div>
	);
};

// Flashcard コンポーネントの Props 型
interface FlashcardProps {
	cardData: CardData;
	mode: Mode;
	onNext: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ cardData, mode, onNext }) => {
	const [isFlipped, setIsFlipped] = useState<boolean>(false);
	const [showHint, setShowHint] = useState<boolean>(false);

	useEffect(() => {
		setIsFlipped(false);
		setShowHint(false);
	}, []);

	const question =
		mode === "personToDesc" ? cardData.person : cardData.description;
	const answer =
		mode === "personToDesc" ? cardData.description : cardData.person;

	return (
		<div>
			<div className="card-container h-80 md:h-72">
				<div className={`card ${isFlipped ? "is-flipped" : ""}`}>
					<div className="card-face card-front">
						<p className="question-text text-center">{question}</p>
					</div>
					<div className="card-face card-back">
						<p className="answer-text text-center">{answer}</p>
					</div>
				</div>
			</div>
			<div
				className={`hint-box mt-4 rounded-md border-yellow-400 border-l-4 bg-yellow-100 p-4 text-yellow-800 ${showHint ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
			>
				<p className="font-bold">ヒント（関連キーワード）:</p>
				<p>{cardData.keywords}</p>
			</div>
			<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
				<button
					type="button"
					onClick={() => setShowHint(!showHint)}
					className="w-full rounded-md bg-yellow-500 px-4 py-2 font-semibold text-white transition hover:bg-yellow-600"
				>
					ヒントを見る
				</button>
				<button
					type="button"
					onClick={() => setIsFlipped(!isFlipped)}
					className="w-full rounded-md bg-green-500 px-4 py-2 font-semibold text-white transition hover:bg-green-600"
				>
					カードをめくる
				</button>
				<button
					type="button"
					disabled={!isFlipped}
					onClick={() => {
						if (!isFlipped) {
							return;
						}
						onNext();
						setIsFlipped(false);
						setShowHint(false);
					}}
					className="w-full rounded-md bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
				>
					次のカード
				</button>
			</div>
		</div>
	);
};

// Quiz コンポーネントの Props 型
interface QuizProps {
	questionData: CardData;
	onNext: () => void;
}

const Quiz: React.FC<QuizProps> = ({ questionData, onNext }) => {
	const [options, setOptions] = useState<string[]>([]);
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

	const correctAnswer = useMemo(() => questionData.person, [questionData]);

	useEffect(() => {
		setSelectedAnswer(null);
		setIsCorrect(null);

		const distractors = data
			.filter((item) => item.person !== correctAnswer)
			.sort(() => 0.5 - Math.random())
			.slice(0, 3)
			.map((item) => item.person);

		setOptions(shuffle([...distractors, correctAnswer]));
	}, [correctAnswer]);

	const handleAnswerClick = (option: string) => {
		if (selectedAnswer) return;

		setSelectedAnswer(option);
		setIsCorrect(option === correctAnswer);
	};

	const getButtonClass = (option: string): string => {
		if (!selectedAnswer) {
			return "border-gray-300 hover:bg-gray-100 hover:border-indigo-500";
		}
		if (option === correctAnswer) {
			return "border-green-500 bg-green-100 hover:bg-green-200";
		}
		if (option === selectedAnswer && !isCorrect) {
			return "border-gray-500 bg-gray-100 hover:bg-gray-200";
		}
		return "border-gray-300 bg-gray-100 cursor-not-allowed";
	};

	return (
		<div>
			<div className="rounded-xl bg-white p-6 shadow-md">
				<p className="mb-6 min-h-[100px] font-medium text-gray-800 text-lg">
					{questionData.description}
				</p>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{options.map((option) => (
						<button
							type="button"
							key={option}
							onClick={() => handleAnswerClick(option)}
							disabled={!!selectedAnswer}
							className={`btn-option w-full rounded-lg border-2 p-4 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getButtonClass(option)}`}
						>
							{option}
						</button>
					))}
				</div>
				{selectedAnswer && (
					<div
						className={`mt-4 text-center font-bold text-2xl ${isCorrect ? "text-green-600" : "text-red-600"}`}
					>
						{isCorrect
							? "正解！"
							: `不正解... 正解は「${correctAnswer}」です。`}
					</div>
				)}
			</div>
			<div className="mt-6 text-center">
				{selectedAnswer && (
					<button
						type="button"
						onClick={onNext}
						className="w-full rounded-md bg-blue-500 px-8 py-2 font-semibold text-white transition hover:bg-blue-600 sm:w-auto"
					>
						次の問題へ
					</button>
				)}
			</div>
		</div>
	);
};

// Completion コンポーネントの Props 型
interface CompletionProps {
	onRestart: () => void;
}

const Completion: React.FC<CompletionProps> = ({ onRestart }) => {
	return (
		<div className="rounded-xl bg-white p-8 text-center shadow-md">
			<h2 className="mb-4 font-bold text-2xl text-green-600">
				お疲れ様でした！
			</h2>
			<p className="mb-6 text-gray-700">
				選択したカテゴリーのカードはすべて完了しました。
			</p>
			<button
				type="button"
				onClick={onRestart}
				className="rounded-md bg-indigo-600 px-6 py-2 font-semibold text-white transition hover:bg-indigo-700"
			>
				もう一度挑戦する
			</button>
		</div>
	);
};

// --- 親コンポーネント (アプリケーション本体) ---
export const FlashcardSW: React.FC = () => {
	const [gameState, setGameState] = useState<GameState>("settings");
	const [settings, setSettings] = useState<SettingsState>({
		category: "all",
		mode: "personToDesc",
	});
	const [currentDeck, setCurrentDeck] = useState<CardData[]>([]);
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const startGame = (newSettings: SettingsState) => {
		setSettings(newSettings);
		const filteredData =
			newSettings.category === "all"
				? data
				: data.filter((item) => item.category === newSettings.category);

		if (filteredData.length === 0) {
			alert("選択されたカテゴリーにカードがありません。");
			return;
		}

		setCurrentDeck(shuffle(filteredData));
		setCurrentIndex(0);
		setGameState("playing");
	};

	const handleNext = () => {
		if (currentIndex < currentDeck.length - 1) {
			// 問題番号をフラッシュカードの上に表示。ただしalertは表示しない。加えてフラッシュカードが見えないようにする。
			const flashcardContainer = document.querySelector(".card-container");
			if (flashcardContainer) {
				flashcardContainer.classList.add("invisible");
			}
			setTimeout(() => {
				if (flashcardContainer) {
					flashcardContainer.classList.remove("invisible");
				}
			}, 500);

			setCurrentIndex(currentIndex + 1);
		} else {
			setGameState("completed");
		}
	};

	const restartGame = () => {
		setGameState("settings");
	};

	const renderContent = () => {
		switch (gameState) {
			case "playing": {
				const currentCardData = currentDeck[currentIndex];
				if (!currentCardData) return null; // データがない場合のガード

				if (settings.mode === "multipleChoice") {
					return <Quiz questionData={currentCardData} onNext={handleNext} />;
				}
				return (
					<Flashcard
						cardData={currentCardData}
						mode={settings.mode}
						onNext={handleNext}
					/>
				);
			}
			case "completed":
				return <Completion onRestart={restartGame} />;
			default:
				return <Settings onStart={startGame} />;
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 text-gray-800">
			<div className="mx-auto w-full max-w-3xl">
				<h1 className="mb-6 text-center font-bold text-3xl text-gray-700">
					社会福祉士 暗記カード
				</h1>
				{gameState === "playing" && (
					<Progress current={currentIndex} total={currentDeck.length} />
				)}
				{renderContent()}
			</div>
		</div>
	);
};
