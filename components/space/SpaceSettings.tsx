import React from "react";
import { FiSettings, FiShare2, FiLink } from "react-icons/fi";

const SpaceSettings = () => {
	return (
		<div className="p-4 bg-gray-200">
			<h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
				Space Settings
			</h2>
			<div className="flex flex-col space-y-2">
				{[
					{ icon: FiSettings, text: "Settings" },
					{ icon: FiShare2, text: "Share" },
					{ icon: FiLink, text: "Copy Link" },
				].map((item, index) => (
					<button
						key={item.text}
						type="button"
						className="flex items-center space-x-2 p-2 hover:bg-gray-300 rounded text-sm sm:text-base"
					>
						<item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
						<span>{item.text}</span>
					</button>
				))}
			</div>
		</div>
	);
};

export default SpaceSettings;
