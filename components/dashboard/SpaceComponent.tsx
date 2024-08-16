import Image from "next/image";
import { IoLink } from "react-icons/io5";

interface SpaceComponentProps {
	link?: string;
	members: number;
	screen: string;
	pfp: string;
}

export const SpaceComponent: React.FC<SpaceComponentProps> = ({
	link,
	members,
	screen,
	pfp,
}) => {
	return (
		<div className="flex flex-col">
			<div className="relative w-full h-56 rounded-2xl border-4 border-gray-800 ">
				<Image
					src={screen}
					alt="Space"
					fill={true}
					sizes="100%"
					priority
					className="rounded-xl object-cover"
				/>
			</div>
			<div className="flex items-center text-sm sm:text-base">
				<div className="pr-96">
					<div className="flex items-center">
						<p className="font-bold">Space Name</p>
						{link && <IoLink className="w-5 h-5 ml-2 text-gray-500" />}
					</div>
				</div>
				<div className="relative w-6 h-6">
					<Image
						src={pfp}
						alt="Member Icon"
						sizes="100%"
						fill={true}
						className="rounded-[10px] object-fill"
					/>
				</div>
			</div>
		</div>
	);
};
