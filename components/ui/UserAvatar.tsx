"use client"

import Image from "next/image";
import { FaRegUserCircle } from "react-icons/fa";

interface AvatarProps {
	icon?: string;
	userId: string;
	username: string;
	nickname?: string;
	size?: "small" | "medium" | "large";
	color?: string;
}

const Avatar: React.FC<AvatarProps> = ({
	icon,
	userId,
	username,
	nickname,
	size = "medium",
	color = "#000000",
}) => {
	const sizeClasses = {
		small: "w-8 h-8 text-xs",
		medium: "w-12 h-12 text-sm",
		large: "w-16 h-16 text-base",
	};

	return (
		<div className="relative inline-block ml-5 mt-5 group">
			<div
				className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center`}
				style={{ backgroundColor: color }}
			>
				{icon ? (
					<Image src={icon} alt={username} layout="fill" objectFit="cover" />
				) : (
					<FaRegUserCircle className="w-3/4 h-3/4 text-white" />
				)}
			</div>
			<div className="absolute left-1/2 bottom-full transform -translate-x-1/2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-500 text-white p-2 rounded mb-1 text-xs whitespace-nowrap z-10">
				<p>Username: {username}</p>
				<p>User ID: {userId}</p>
				{nickname && <p>Nickname: {nickname}</p>}
			</div>
		</div>
	);
};

export default Avatar;
