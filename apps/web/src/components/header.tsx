import { Link } from "@tanstack/react-router";

import { ModeToggle } from "./mode-toggle";

export default function Header() {
	const links = [
		{ to: "/", label: "Home" },
		{ to: "/blog", label: "Blog" },
		{ to: "/tools", label: "Tools" },
	];

	return (
		<div>
			<Link to="/" className="font-bold text-2xl">
				<h1>KAKOSUKE</h1>
			</Link>
			<div className="flex flex-row items-center justify-between px-2 py-1">
				<nav className="flex gap-4 text-lg">
					{links.map(({ to, label }) => {
						return (
							<Link key={to} to={to}>
								{label}
							</Link>
						);
					})}
				</nav>
				<div className="flex items-center gap-2">
					<ModeToggle />
				</div>
			</div>
			<hr />
		</div>
	);
}
