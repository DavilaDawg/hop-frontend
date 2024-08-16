import { useState } from "react";
import Image from "next/image";
import { Button } from "@components/ui/Button";
import DeleteFriendComponent from "./RemoveFriend";

interface FriendProfileProps {
	friend: {
		id: string;
		nickname: string;
		username: string;
		profilePicture?: string;
		isOnline?: boolean;
		currentRoom?: string;
	};
	onClose: () => void;
	onFriendRemoved: (friendId: string) => void;
}

const FriendProfileRemoveBTN: React.FC<FriendProfileProps> = ({
	friend,
	onClose,
	onFriendRemoved,
}) => {
	const defaultProfilePicture = "/images/pfp-placeholder.png";

	return (
		<div className="bg-gray-700 p-6 rounded-xl shadow-lg">
			<button
				onClick={onClose}
				className="float-right text-gray-400 hover:text-white"
				type="button"
			>
				&times; Close
			</button>
			<div className="flex flex-col items-center">
				<div className="w-24 h-24 rounded-full overflow-hidden relative mb-4">
					<Image
						src={friend.profilePicture || defaultProfilePicture}
						alt={`${friend.nickname}'s profile picture`}
						fill={true}
						sizes="100%"
						className="object-cover"
					/>
				</div>
				<h2 className="text-2xl font-bold text-white mb-2">
					{friend.nickname}
				</h2>
				<p className="text-gray-400 mb-4">@{friend.username}</p>
				<div className="flex items-center mb-4">
					<div
						className={`w-3 h-3 rounded-full mr-2 ${friend.isOnline ? "bg-green-400" : "bg-gray-500"}`}
					/>
					<span className="text-gray-300">
						{friend.isOnline ? "Online" : "Offline"}
					</span>
				</div>
				{friend.currentRoom && (
					<p className="text-gray-300">Currently in: {friend.currentRoom}</p>
				)}
				<div className="flex flex-col items-center mt-4">
					<Button
						className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2"
						type="button"
					>
						Send message
					</Button>
					<DeleteFriendComponent
						friendId={friend.id}
						onFriendRemoved={onFriendRemoved}
					/>
				</div>
			</div>
		</div>
	);
};

export default FriendProfileRemoveBTN;
