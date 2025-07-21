export default function TagParts({ name }: { name: string }) {
	return (
		<span className="inline-block rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800 text-sm transition-colors duration-200 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700">
			{name}
		</span>
	);
}
