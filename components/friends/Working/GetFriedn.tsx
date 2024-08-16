import React, { useState } from "react";
import { ServiceMethods } from "@lib/servicesMethods";
import { useUser } from "@stackframe/stack";
import { Button } from "@components/ui/Button";

interface Friend {
	id: string;
	username: string;
	nickname: string;
	profilePicture: string;
	// Add any other fields that are returned by the /user/friend endpoint
}

const FetchAllFriendsComponent = () => {
	const user = useUser({ or: "redirect" });
	const [friends, setFriends] = useState<Friend[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchFriends = async () => {
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
		} catch (err) {
			console.error("Error fetching friends:", err);
			if (err instanceof Error) {
				setError(`Failed to fetch friends: ${err.message}`);
			} else {
				setError("An unexpected error occurred while fetching friends.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-4">
			<h2 className="text-xl font-bold mb-4">My Friends</h2>
			<Button onClick={fetchFriends} disabled={loading}>
				{loading ? "Loading..." : "Fetch Friends"}
			</Button>

			{error && (
				<div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
					<p>{error}</p>
				</div>
			)}

			{friends.length > 0 && (
				<ul className="mt-4 space-y-2">
					{friends.map((friend) => (
						<li key={friend.id} className="p-2 border rounded">
							<p>
								<strong>Username:</strong> {friend.username}
							</p>
							<p>
								<strong>Nickname:</strong> {friend.nickname}
							</p>
							{friend.profilePicture && (
								<img
									src={friend.profilePicture}
									alt={`${friend.username}'s profile`}
									className="w-10 h-10 rounded-full mt-1"
								/>
							)}
						</li>
					))}
				</ul>
			)}

			{friends.length === 0 && !loading && (
				<p className="mt-2">No friends found. Try adding some friends!</p>
			)}
		</div>
	);
};

export default FetchAllFriendsComponent;
