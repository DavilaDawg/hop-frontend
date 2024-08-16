import Image from "next/image";

interface SingleFriendProps {
	id: string;
	nickname: string;
	username: string;
	profilePicture?: string;
	isOnline?: boolean;
	currentRoom?: string;
	onClick: () => void;
}

const SingleFriend: React.FC<SingleFriendProps> = ({
	profilePicture,
	nickname,
	username,
	id,
	isOnline = false,
	currentRoom = "",
	onClick,
}) => {
	const defaultProfilePicture = "/images/pfp-placeholder.png";

	return (
		<div
			className="flex items-center p-3 rounded-2xl bg-gray-700 shadow-md space-x-4 cursor-pointer hover:bg-gray-600 transition-colors duration-200"
			onClick={onClick}
			onKeyDown={onClick}
			onKeyPress={onClick}
			onKeyUp={onClick}
			role="button"
			tabIndex={0}
		>
			<div className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden relative">
				<Image
					// src={ `${profilePicture}` || defaultProfilePicture}
					src={defaultProfilePicture}
					alt={`${nickname}'s profile picture`}
					fill={true}
					sizes="100%"
					className="object-cover"
				/>
			</div>
			<div className="flex-1 flex flex-col justify-center">
				<div className="flex items-center space-x-2">
					<div className="text-white font-semibold text-lg">{nickname}</div>
					<div
						className={`w-3.5 h-3.5 rounded-full ${
							isOnline ? "bg-green-400" : "bg-gray-500"
						}`}
					/>
				</div>
				<div className="text-gray-400 text-sm">
					{currentRoom || `@${username}`}
				</div>
			</div>
		</div>
	);
};

export default SingleFriend;
