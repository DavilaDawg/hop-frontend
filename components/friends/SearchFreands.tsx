"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

interface SlidingSearchBarProps {
	onSearch: (query: string) => void;
}

const SlidingSearchBar: React.FC<SlidingSearchBarProps> = ({ onSearch }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const toggleSearch = () => {
		setIsOpen(!isOpen);
		if (!isOpen) {
			setTimeout(() => document.getElementById("search-input")?.focus(), 300);
		}
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch(searchQuery);
	};
	const handleClose = () => {
		setIsOpen(false);
		setSearchQuery("");
		onSearch("");
	};

	return (
		<div className="relative flex items-center">
			<button
				onClick={toggleSearch}
				className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center focus:outline-none hover:bg-gray-600 transition-colors duration-200"
				type="button"
			>
				<Search className="text-gray-300" />
			</button>
			<div
				className={`absolute right-0 top-0 h-10 overflow-hidden rounded-xl transition-all duration-300 ease-in-out ${
					isOpen ? "w-52" : "w-0"
				}`}
			>
				<form onSubmit={handleSearch} className="h-full flex">
					<input
						id="search-input"
						type="text"
						placeholder="Search friends..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full h-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
					/>
					{isOpen && (
						<button
							type="button"
							onClick={handleClose}
							className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
						>
							<X size={20} />
						</button>
					)}
				</form>
			</div>
		</div>
	);
};

export default SlidingSearchBar;
