import Image from "next/image";
import { FaRegUserCircle } from "react-icons/fa";
interface AvatarProps {
	icon?: string;
	username: string;
	nickname?: string;
	color?: string;
}

const Avatar: React.FC<AvatarProps> = ({
	icon,
	username,
	nickname,
	color = "blue", // eventually send this prop
}) => {

	return (
		<div className="relative inline-block ml-5 mt-5 group">
			<div className="relative rounded-full overflow-hidden flex items-center justify-center border-3 w-12 h-12 text-sm">
				{icon ? (
					<Image
						src={icon}
						alt={username}
						fill={true}
						sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
						className="object-cover rounded-full"
					/>
				) : (
					<FaRegUserCircle className="w-[100%] h-[100%] text-white" />
				)}
			</div>
			<div className="absolute left-1/2 bottom-full transform -translate-x-1/2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-500 text-white p-2 rounded mb-1 text-xs whitespace-nowrap z-10">
				<p>Username: {username}</p>
				{nickname && <p>Nickname: {nickname}</p>}
			</div>
		</div>
	);
};

export default Avatar;
