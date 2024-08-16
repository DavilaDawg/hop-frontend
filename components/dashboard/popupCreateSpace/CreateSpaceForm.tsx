import { useState, useEffect, useCallback } from "react";
import { Search, X, Copy } from "lucide-react";
import debounce from "lodash/debounce";
import useCreateSpace from "./hooks/CreateNewSpace";
import useAddUserToSpace from "./hooks/AddFriendsSpace";
import { useUser } from "@stackframe/stack";
import { ServiceMethods } from "@lib/servicesMethods";
import { generateUUID, generatePassword } from "./UUID&PasswordGenerator";

interface User {
	id: string;
	nickname: string;
	username: string;
	profilePicture?: string;
}

const CreateSpaceForm: React.FC = () => {
	const user = useUser({ or: "redirect" });
	const [friends, setFriends] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const {
		createSpace,
		loading: creating,
		error: createError,
		success,
	} = useCreateSpace();
	const { addUser, loading: adding, error: addError } = useAddUserToSpace();

	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<User[]>([]);
	const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
	const [spaceName, setSpaceName] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);
	const [spaceId, setSpaceId] = useState<string | null>(null);
	const [spacePassword, setSpacePassword] = useState<string | null>(null);
	const [isSpaceCreated, setIsSpaceCreated] = useState(false);

	useEffect(() => {
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
				setError(
					err instanceof Error
						? `Failed to fetch friends: ${err.message}`
						: "An unexpected error occurred while fetching friends.",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchFriends();
	}, [user]);
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const debouncedSearch = useCallback(
		debounce((query: string) => {
			if (query && friends) {
				const filtered = friends
					.filter(
						(friend) =>
							(friend.nickname?.toLowerCase() || "").includes(
								query.toLowerCase(),
							) ||
							(friend.username?.toLowerCase() || "").includes(
								query.toLowerCase(),
							),
					)
					.slice(0, 4);
				setSearchResults(filtered);
			} else {
				setSearchResults([]);
			}
		}, 300),
		[friends],
	);
	useEffect(() => {
		debouncedSearch(searchQuery);
	}, [searchQuery, debouncedSearch]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
	};

	const handleUserClick = async (user: User) => {
		if (!selectedUsers.some((selectedUser) => selectedUser.id === user.id)) {
			if (spaceId) {
				try {
					await addUser({
						spaceId,
						userId: user.id,
						role: "member",
					});
					setSelectedUsers([...selectedUsers, user]);
				} catch (error) {
					console.error("Failed to add user to space:", error);
				}
			} else {
				setSelectedUsers([...selectedUsers, user]);
			}
		}
		setSearchQuery("");
		setSearchResults([]);
	};

	const handleRemoveUser = (user: User) => {
		setSelectedUsers(
			selectedUsers.filter((selectedUser) => selectedUser.id !== user.id),
		);
	};

	const handleCreateSpace = () => {
		if (!spaceName.trim()) {
			alert("Please enter a space name");
			return;
		}

		const newSpaceId = generateUUID();
		const newSpacePassword = generatePassword();

		setIsSpaceCreated(true);
		setSpaceId(newSpaceId);
		setSpacePassword(newSpacePassword);
		createSpace({
			id: newSpaceId,
			password: newSpacePassword,
			userId: user.id,
			name: spaceName,
			theme: "default",
			flyUrl: "",
		})
			.then(() => {
				for (const user of selectedUsers) {
					addUser({
						spaceId: newSpaceId,
						userId: user.id,
						role: "member",
					});
				}
			})
			.catch((error) => {
				console.error("Failed to create space or add members:", error);
				alert("An error occurred while creating the space or adding members.");
			});
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).then(
			() => {
				alert("Copied to clipboard!");
			},
			(err) => {
				console.error("Could not copy text: ", err);
			},
		);
	};

	const spaceUrl = spaceId ? `http://localhost:3000/space/${spaceId}` : null;

	return (
		<div className="w-full max-w-md mx-auto p-4 bg-gray-800 rounded-lg">
			<input
				type="text"
				placeholder="Space name"
				value={spaceName}
				onChange={(e) => setSpaceName(e.target.value)}
				className="w-full h-10 px-3 py-1 mb-6 bg-gray-700 text-white placeholder-gray-400 focus:outline-none rounded-xl text-sm"
			/>

			<form onSubmit={handleSearch} className="mb-4 relative">
				<div className="flex">
					<input
						type="text"
						placeholder="Add member"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="flex-grow h-10 px-3 py-1 bg-gray-700 text-white placeholder-gray-400 focus:outline-none rounded-l-xl text-sm"
					/>
					<button
						type="submit"
						className="h-10 bg-blue-500 text-white px-4 rounded-r-xl hover:bg-blue-600 transition-colors duration-200"
					>
						<Search size={16} />
					</button>
				</div>
				<div className="absolute left-0 right-0 mt-1 z-10 bg-slate-400/30 backdrop-blur-sm rounded-xl shadow-lg">
					{searchResults.map((user) => (
						<div
							key={user.id}
							onClick={() => handleUserClick(user)}
							onKeyDown={() => {}}
							className="cursor-pointer hover:bg-gray-700 p-2 rounded-xl"
						>
							<span className="text-white">{user.username}</span>
						</div>
					))}
				</div>
			</form>

			<div className="mb-4">
				<h3 className="text-white mb-2">Members to add</h3>
				<div className="h-[100px] overflow-y-auto pr-2 space-y-2">
					{selectedUsers.map((user) => (
						<div
							key={user.id}
							className="flex items-center justify-between bg-gray-700 rounded-xl p-2"
						>
							<span className="text-white">{user.username}</span>
							<button
								type="button"
								onClick={() => handleRemoveUser(user)}
								className="text-red-500 hover:text-red-600"
							>
								<X size={16} />
							</button>
						</div>
					))}
				</div>
			</div>

			<div className="flex items-center justify-between mb-4">
				<span className="text-white">Privacy setting</span>
				<label className="flex items-center cursor-pointer">
					<div className="relative">
						<input
							type="checkbox"
							className="sr-only"
							checked={isPrivate}
							onChange={() => setIsPrivate(!isPrivate)}
						/>
						<div
							className={`block w-14 h-8 rounded-full ${
								isPrivate ? "bg-blue-500" : "bg-gray-600"
							}`}
						/>
						<div
							className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
								isPrivate ? "transform translate-x-6" : ""
							}`}
						/>
					</div>
				</label>
			</div>

			<button
				type="button"
				onClick={handleCreateSpace}
				className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-colors duration-200"
			>
				Create Space
			</button>

			{isSpaceCreated && spaceId && spacePassword && (
				<div className="mt-4 p-4 bg-gray-700 rounded-xl">
					<h3 className="text-white font-bold mb-2">
						Space Details (Creation in progress)
					</h3>
					<div className="flex items-center justify-between mb-2">
						<span className="text-white">Space ID:</span>
						<div className="flex items-center">
							<span className="text-blue-300 mr-2">{spaceId}</span>
							<button
								type="button"
								onClick={() => copyToClipboard(spaceUrl ?? "")}
								className="text-gray-400 hover:text-white"
							>
								<Copy size={16} />
							</button>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-white">Password:</span>
						<div className="flex items-center">
							<span className="text-blue-300 mr-2">{spacePassword}</span>
							<button
								type="button"
								onClick={() => copyToClipboard(spacePassword)}
								className="text-gray-400 hover:text-white"
							>
								<Copy size={16} />
							</button>
						</div>
					</div>
				</div>
			)}

			{(createError || addError) && (
				<div className="mt-2 text-red-500">
					Error: {createError || addError}
				</div>
			)}
		</div>
	);
};

export default CreateSpaceForm;
