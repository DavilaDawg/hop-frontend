"use client";

import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { FaUserFriends } from "react-icons/fa";
import OnlineFriendsContainer from "./OnlineFriendsContainer";

const LeftSidebar = () => {
	return (
		<div className="bg-gray-600 text-white p-6 w-72 h-screen flex flex-col shadow-xl rounded-r-lg">
			<Link href="/dashboard">
				<Logo />
			</Link>
			<nav className="flex-1 flex flex-col items-center">
				<Link href="/friends">
					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
					<button
						suppressHydrationWarning
						className="bg-gray-800 w-[240px] h-[40px] mt-1 flex items-center justify-center rounded transition-transform transform hover:scale-105"
					>
						<FaUserFriends className="text-2xl text-black mr-3" />
						<span>Friends</span>
					</button>
				</Link>
				<p className="text-2xl font-bold text-white mt-5 mb-1">
					Online Friends
				</p>
				<OnlineFriendsContainer
					username="yourUsername"
					spaceName="yourSpaceName"
					pfp="yourPfp"
				/>
			</nav>
		</div>
	);
};

export default LeftSidebar;
