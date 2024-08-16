import { useState, useRef } from "react";
import Image from "next/image";
import HoverCard from "./HoverCard";

interface OnlineFriendProps {
	id: string;
	nickname: string;
	username: string;
	profilePicture?: string;
	isOnline?: boolean;
	currentRoom?: string;
}

const OnlineFriend: React.FC<OnlineFriendProps> = (friend) => {
	const [showHoverCard, setShowHoverCard] = useState(false);
	const friendRef = useRef<HTMLDivElement>(null);
	const defaultProfilePicture = "/images/pfp-placeholder.png";

	return (
		<div
			ref={friendRef}
			className="mt-1 mb-3 bg-gray-700 rounded-xl h-12 flex items-center px-2 relative"
			onMouseEnter={() => setShowHoverCard(true)}
			onMouseLeave={() => setShowHoverCard(false)}
		>
			<div className="relative w-10 h-10 bg-gray-500 rounded-full flex-shrink-0 overflow-hidden">
				<Image
					src={friend.profilePicture || defaultProfilePicture}
					alt={`${friend.nickname}'s profile picture`}
					fill={true}
					sizes="100%"
					className="object-cover"
				/>
			</div>
			<div className="flex-1 flex flex-col justify-center ml-2">
				<div className="flex items-center space-x-2">
					<div className="text-white font-semibold text-sm">
						{friend.nickname}
					</div>
					<div
						className={`w-2 h-2 rounded-full ${friend.isOnline ? "bg-gray-500" : "bg-green-400"}`}
					/>
				</div>
				<div className="text-gray-400 text-xs">
					{friend.currentRoom || `@${friend.username}`}
				</div>
			</div>
			{showHoverCard && <HoverCard friend={friend} parentRef={friendRef} />}
		</div>
	);
};

export default OnlineFriend;
