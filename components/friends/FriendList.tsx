"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import SingleFriend from "./FriendComponent";
import FriendProfileRemoveBTN from "./FriendProfileRemove";
import SlidingSearchBar from "./SearchFreands";
import GlobalFriendSearch from "./GlobalFriendSearch";
import { ServiceMethods } from "@lib/servicesMethods";
import { useUser } from "@stackframe/stack";

interface Friend {
	id: string;
	nickname: string;
	username: string;
	profilePicture?: string;
	isOnline?: boolean;
	currentRoom?: string;
}

const FriendList: React.FC = () => {
	const user = useUser({ or: "redirect" });
	const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [friends, setFriends] = useState<Friend[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [hasFetched, setHasFetched] = useState(false);

	const fetchFriends = useCallback(async () => {
		if (!user || hasFetched) return;
		setLoading(true);
		setError(null);
		try {
			const { accessToken, refreshToken } = await user.getAuthJson();
			const serviceMethods = new ServiceMethods(
				accessToken || "",
				refreshToken || "",
			);
			const response = await serviceMethods.fetchAllFriends();
			setFriends(response);
			setHasFetched(true);
		} catch (err) {
			console.error("Error fetching friends:", err);
			setError(
				err instanceof Error
					? `Failed to fetch friends: ${err.message}`
					: "An unexpected error occurred while fetching friends.",
			);
		} finally {
			setLoading(false);
		}
	}, [user, hasFetched]);

	useEffect(() => {
		fetchFriends();
	}, [fetchFriends]);

	const filteredFriends = useMemo(() => {
		return friends.filter((friend) => {
			const lowercaseQuery = searchQuery.toLowerCase();
			return (
				(friend.nickname?.toLowerCase() || "").includes(lowercaseQuery) ||
				(friend.username?.toLowerCase() || "").includes(lowercaseQuery)
			);
		});
	}, [searchQuery, friends]);

	const handleFriendClick = (friend: Friend) => {
		setSelectedFriend(friend);
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	const handleGlobalAddFriend = (query: string) => {
		console.log("Searching for new friend:", query);
	};

	const handleCloseProfile = () => {
		setSelectedFriend(null);
	};

	const handleFriendRemoved = (friendId: string) => {
		setFriends((prevFriends) =>
			prevFriends.filter((friend) => friend.id !== friendId),
		);
		setSelectedFriend(null);
	};

	if (loading && friends.length === 0) {
		return <div className="text-center">Loading friends...</div>;
	}

	if (error && friends.length === 0) {
		return <div className="text-center text-red-500">{error}</div>;
	}

	return (
		<div className="flex h-full w-full ml-3 mr-3 mt-4 rounded-xl bg-gray-600 relative">
			<div className="w-2/5 overflow-auto px-6 pb-6">
				<div className="flex justify-between items-center mb-4 px-6 pt-3">
					<h2 className="text-2xl font-bold">Friends</h2>
					<SlidingSearchBar onSearch={handleSearch} />
				</div>
				<div className="flex-grow overflow-y-auto px-6 pb-6 rounded-2xl">
					<div className="flex flex-col space-y-4">
						{filteredFriends.map((friend) => (
							<SingleFriend
								key={friend.id}
								{...friend}
								onClick={() => handleFriendClick(friend)}
							/>
						))}
					</div>
				</div>
			</div>
			<div className="w-3/5 p-6">
				{selectedFriend ? (
					<FriendProfileRemoveBTN
						friend={selectedFriend}
						onClose={handleCloseProfile}
						onFriendRemoved={handleFriendRemoved}
					/>
				) : (
					<div className="flex items-center justify-center h-full text-gray-400">
						Select a friend to view their profile
					</div>
				)}
			</div>
			<GlobalFriendSearch onAddFriend={handleGlobalAddFriend} />
		</div>
	);
};

export default FriendList;
