import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
			<h1 className="text-[9rem] font-bold text-indigo-600">Hop</h1>
			<nav className="mt-6 flex gap-4">
				<Link
					href="/sign-in"
					className="text-3xl font-bold text-gray-700 hover:text-blue-500 transition-colors"
				>
					Sign In
				</Link>
				<Link
					href="/sign-up"
					className="text-3xl font-bold text-gray-700 hover:text-blue-500 transition-colors"
				>
					Sign Up
				</Link>
				<Link
					href="/dashboard"
					className="text-3xl font-bold text-gray-700 hover:text-blue-500 transition-colors"
				>
					Dashboard
				</Link>
				<Link
					href="/friends"
					className="text-3xl font-bold text-gray-700 hover:text-red-500 transition-colors"
				>
					Friends
				</Link>
				<Link
					href="/space/1"
					className="text-3xl font-bold text-gray-700 hover:text-blue-500 transition-colors"
				>
					Space
				</Link>
			</nav>
		</div>
	);
}
