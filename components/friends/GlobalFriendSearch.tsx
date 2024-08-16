"use client";

import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import PopContainer from "./PopUpContainer";
import { ServiceMethods } from "@lib/servicesMethods";
import { useUser } from "@stackframe/stack";

interface AddFriendComponentProps {
	onAddFriend: (friendId: string) => void;
}

const AddFriendComponent: React.FC<AddFriendComponentProps> = ({
	onAddFriend,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [friendId, setFriendId] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const user = useUser({ or: "redirect" });

	const togglePopup = () => {
		setIsOpen(!isOpen);
		if (!isOpen) {
			setFriendId("");
			setError(null);
			setSuccess(false);
		}
	};

	const handleClose = () => {
		setIsOpen(false);
		setFriendId("");
		setError(null);
		setSuccess(false);
	};

	const addFriend = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!friendId.trim()) {
			setError("Please enter a friend ID");
			return;
		}

		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const { accessToken, refreshToken } = await user.getAuthJson();
			const serviceMethods = new ServiceMethods(
				accessToken || "",
				refreshToken || "",
			);
			const response = await serviceMethods.fetchAddFriend(friendId);

			const result = await response.json();

			if (response.ok) {
				setSuccess(true);
				setFriendId("");
				onAddFriend(friendId);
			} else {
				throw new Error(result.message || "Failed to add friend");
			}
		} catch (err) {
			console.error("Error adding friend:", err);
			if (err instanceof Error) {
				setError(`Failed to add friend: ${err.message}`);
			} else {
				setError("An unexpected error occurred while adding friend.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<button
				onClick={togglePopup}
				className="absolute bottom-6 right-6 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center focus:outline-none hover:bg-blue-600 transition-colors duration-200 shadow-lg"
				type="button"
			>
				<UserPlus className="text-white" size={20} />
			</button>

			<PopContainer isOpen={isOpen} onClose={handleClose}>
				<div className="p-6 w-96">
					<h2 className="text-2xl font-bold mb-4 text-white">Add Friend</h2>
					<form onSubmit={addFriend} className="mb-4">
						<div className="flex">
							<input
								id="add-friend-input"
								type="text"
								placeholder="Enter friend ID..."
								value={friendId}
								onChange={(e) => setFriendId(e.target.value)}
								className="flex-grow h-10 px-3 py-1 bg-gray-700 text-white placeholder-gray-400 focus:outline-none rounded-l-md text-sm"
							/>
							<button
								type="submit"
								className="h-10 bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600 transition-colors duration-200"
								disabled={loading}
							>
								{loading ? "Adding..." : "Add"}
							</button>
						</div>
					</form>

					{error && (
						<div
							className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
							role="alert"
						>
							<div className="font-medium">Error</div>
							<div>{error}</div>
						</div>
					)}

					{success && (
						<div
							className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg"
							role="alert"
						>
							<div className="font-medium">Success</div>
							<div>Friend added successfully!</div>
						</div>
					)}

					<button
						onClick={handleClose}
						type="button"
						className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
					>
						Close
					</button>
				</div>
			</PopContainer>
		</>
	);
};

export default AddFriendComponent;
