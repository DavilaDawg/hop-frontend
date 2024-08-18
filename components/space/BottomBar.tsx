import type React from "react";
import Avatar from "@components/ui/UserAvatar";
import { Slider } from "@/components/ui/slider";
import { IoMdVolumeHigh } from "react-icons/io";
import SelectCursor from "./SelectCursor";
import { useUser } from "@stackframe/stack";
import { useEffect, useState } from "react";
import { ServiceMethods } from "@lib/servicesMethods";
interface UserState {
	username: string;
	color: string;
	cursor: string;
	x: number;
	y: number;
}
interface User {
	username: string;
	nickname: string;
	pfp: string;
	state: UserState;
}
interface Users {
	[uuid: string]: User;
}
interface BottomBarProps {
	setSelectedCursor: (cursor: string) => void;
	otherUsers: Users;
}

const BottomBar: React.FC<BottomBarProps> = ({
	setSelectedCursor,
	otherUsers,
}) => {
	const [username, setUsername] = useState("");
	const [nickname, setNickname] = useState("");
	const [pfp, setPfp] = useState("");

	const user = useUser({ or: "redirect" });

	const fetch = async () => {
		try {
			const { accessToken, refreshToken } = await user.getAuthJson();
			if (!accessToken || !refreshToken) return;
			const serviceMethods = new ServiceMethods(accessToken, refreshToken);
			const result = await serviceMethods.fetchUser();
			return result;
		} catch (error) {
			console.error("Error during submission:", error);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const fetchAndSetUserData = async () => {
			const result = await fetch();
			if (result) {
				setUsername(result.username);
				setNickname(result.nickname);
				setPfp(result.profilePicture);
			} else {
				setUsername("User1"); // CHANGE TO RANDOM NUMBER
				setNickname("user");
				setPfp("");
			}
		};
		fetchAndSetUserData();
	}, [user]);

	return (
		<div className="bg-gray-200 p-3 flex items-center justify-between">
			{/* <SelectCursor setSelectedCursor={setSelectedCursor} /> */}
			<div className="flex-1 flex justify-center ml-[32%] mb-[0.5%]">
				<Avatar username={username} nickname={nickname} icon={pfp} />

				{Object.keys(otherUsers).map((uuid) => {
					const user = otherUsers[uuid];

					const userUsername = user?.username || "Unknown";
					const userNickname = user?.nickname || "No nickname";
					const userPfp = user?.pfp || "";

					return (
						<Avatar
							key={uuid}
							username={userUsername}
							nickname={userNickname}
							icon={userPfp}
						/>
					);
				})}
			</div>

			<div className="w-1/3 flex justify-end items-center space-x-2">
				<IoMdVolumeHigh size={24} />
				<Slider
					className="w-32 bg-gray-400 rounded"
					defaultValue={[33]}
					max={100}
					step={1}
				/>
			</div>
		</div>
	);
};

export default BottomBar;
