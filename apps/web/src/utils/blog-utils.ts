export interface BlogPost {
	slug: string;
	title: string;
	description?: string;
	date: string;
	tags?: string[];
}
export function sortByDate(posts: BlogPost[]) {
	return posts.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);
}
