import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";

interface HoverCardProps {
	friend: {
		id: string;
		nickname: string;
		username: string;
		profilePicture?: string;
		isOnline?: boolean;
		currentRoom?: string;
	};
	parentRef: React.RefObject<HTMLDivElement>;
}

const HoverCard: React.FC<HoverCardProps> = ({ friend, parentRef }) => {
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const defaultProfilePicture = "/images/pfp-placeholder.png";

	useEffect(() => {
		if (parentRef.current) {
			const rect = parentRef.current.getBoundingClientRect();
			const containerRect = parentRef.current
				.closest(".bg-gray-800")
				?.getBoundingClientRect();
			if (containerRect) {
				setPosition({
					top: rect.top - containerRect.top + 100,
					left: containerRect.right - containerRect.left + 10,
				});
			}
		}
	}, [parentRef]);

	const card = (
		<div
			className="fixed z-50 bg-gray-700 p-4 rounded-xl shadow-lg w-64"
			style={{ top: `${position.top}px`, left: `${position.left}px` }}
		>
			<div className="flex flex-col items-center">
				<div className="w-20 h-20 rounded-full overflow-hidden relative mb-3">
					<Image
						src={friend.profilePicture || defaultProfilePicture}
						alt={`${friend.nickname}'s profile picture`}
						fill={true}
						sizes="100%"
						className="object-cover"
					/>
				</div>
				<h2 className="text-xl font-bold text-white mb-1">{friend.nickname}</h2>
				<p className="text-gray-400 mb-2">@{friend.username}</p>
				<div className="flex items-center mb-2">
					<div
						className={`w-2 h-2 rounded-full mr-2 ${friend.isOnline ? "bg-gray-500" : "bg-green-400"}`}
					/>
					<span className="text-gray-300 text-sm">
						{friend.isOnline ? "Offline" : "Online"}
					</span>
				</div>
				{friend.currentRoom && (
					<p className="text-gray-300 text-sm">
						Currently in: {friend.currentRoom}
					</p>
				)}
			</div>
		</div>
	);

	return ReactDOM.createPortal(card, document.body);
};

export default HoverCard;
