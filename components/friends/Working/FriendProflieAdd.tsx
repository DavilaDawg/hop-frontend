import { useState } from "react";
import Image from "next/image";
import { Button } from "@components/ui/Button";
import { ServiceMethods } from "@lib/servicesMethods";
import { useUser } from "@stackframe/stack";

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
	onFriendAdded: (friendId: string) => void;
}

const FriendProfileAddBTN: React.FC<FriendProfileProps> = ({
	friend,
	onClose,
	onFriendAdded,
}) => {
	const user = useUser({ or: "redirect" });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const defaultProfilePicture = "/images/pfp-placeholder.png";

	const addFriend = async () => {
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const { accessToken, refreshToken } = await user.getAuthJson();
			const serviceMethods = new ServiceMethods(
				accessToken || "",
				refreshToken || "",
			);
			const response = await serviceMethods.fetchAddFriend(friend.id);

			// Always try to parse as JSON
			const result = await response.json();

			// Check if the operation was successful
			if (response.ok) {
				setSuccess(true);
				onFriendAdded(friend.id);
			} else {
				// If response is not ok, throw an error with the message from the server
				throw new Error(result.message || "Failed to add friend");
			}
		} catch (err) {
			console.error("Error adding friend:", err);
			if (err instanceof SyntaxError) {
				// This catches JSON parsing errors
				setError(
					"The server response was not in the expected format. The friend might have been added successfully, but please check your friends list to confirm.",
				);
			} else if (err instanceof Error) {
				setError(`Failed to add friend: ${err.message}`);
			} else {
				setError("An unexpected error occurred while adding friend.");
			}
		} finally {
			setLoading(false);
		}
	};

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
					<Button
						onClick={addFriend}
						disabled={loading}
						className="bg-green-500 text-white px-4 py-2 rounded-lg"
					>
						{loading ? "Adding..." : "Add Friend"}
					</Button>
				</div>
				{error && (
					<div
						className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg mt-4"
						role="alert"
					>
						<div className="font-medium">Error</div>
						<div>{error}</div>
					</div>
				)}
				{success && (
					<div
						className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg mt-4"
						role="alert"
					>
						<div className="font-medium">Success</div>
						<div>Friend added successfully!</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default FriendProfileAddBTN;
