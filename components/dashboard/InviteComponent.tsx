"use client";

import { useState } from "react";
import { IoCheckbox } from "react-icons/io5";
import { FaRectangleXmark } from "react-icons/fa6";
import Image from "next/image";
interface InviteProps {
	id: string;
	spaceName: string;
	username: string;
	pfp: string;
	onHandle: (id: string) => void;
}

const InviteComponent: React.FC<InviteProps> = ({
	id,
	spaceName,
	username,
	pfp,
	onHandle,
}) => {
	const [add, setAdd] = useState(false);
	const [decline, setDecline] = useState(false);
	const [handled, setHandled] = useState(false);

	const handleAdd = async () => {
		setAdd(true);

		// post to db somehow

		setHandled(true);
		onHandle(id);
	};

	const handleDecline = () => {
		setDecline(true);
		setHandled(true);
		onHandle(id);
	};

	return (
		!handled && (
			<div className="w-[99%] mt-2 mb-3 bg-gray-700 rounded-xl h-12 flex items-center px-2">
				<div className="relative w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
					<Image
						src={pfp}
						alt="Member Icon"
						fill={true}
						sizes="100%"
						className="object-cover"
					/>
				</div>
				<div className="flex-1 flex flex-col justify-center ml-3">
					<div className="flex items-center space-x-2">
						<div className="text-white font-semibold text-sm">{spaceName}</div>
					</div>
					<div className="text-gray-400 text-xs">{username}</div>
				</div>
				<button type="button" onClick={handleAdd}>
					<IoCheckbox className="text-2xl mr-1" />
				</button>

				<button type="button" onClick={handleDecline}>
					<FaRectangleXmark className="text-[22px]" />
				</button>
			</div>
		)
	);
};

export default InviteComponent;
