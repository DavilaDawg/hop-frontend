"use client";

import OnlineFriend from "@components/friends/OnlineFriend";
import { useState } from "react";

interface Friend {
	id: string;
	nickname: string;
	username: string;
	profilePicture?: string;
	isOnline?: boolean;
	currentRoom?: string;
}

interface OnlineFriendsContainerProps {
	friends: Friend[];
}

const OnlineFriendsContainer: React.FC<OnlineFriendsContainerProps> = ({
	friends,
}) => {
	const onlineFriends = friends.filter((friend) => friend.isOnline);

	const [onlineUser, setOnlineUser] = useState([
		{ id: "1", spaceName: "Space 1", username: "User 1", pfp: "/ani.jpg" },
		{ id: "2", spaceName: "Space 2", username: "User 2", pfp: "/emoji.jpg" },
		{ id: "3", spaceName: "Space 3", username: "User 3", pfp: "/patrick.jpg" },
		{ id: "4", spaceName: "Space 4", username: "User 4", pfp: "/monkey.jpg" },
		{ id: "5", spaceName: "Space 5", username: "User 5", pfp: "/skate.jpg" },
		{ id: "6", spaceName: "Space 6", username: "User 6", pfp: "/PFP.jpg" },
	]); // mock, fetch from backend later

	return (
		<div className="bg-gray-800 w-full h-full p-4 rounded-xl shadow-lg border border-gray-700 overflow-auto">
			<ul className="space-y-3">
				{onlineFriends.map((friend) => (
					<li key={friend.id}>
						<OnlineFriend
							nickname={friend.nickname}
							username={friend.username}
							profilePicture={friend.profilePicture}
							currentRoom={friend.currentRoom}
							id={""}
						/>
					</li>
				))}
			</ul>
		</div>
	);
};

export default OnlineFriendsContainer;
