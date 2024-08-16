"use client";

import { useParams } from "next/navigation";
import VncDisplay from "@components/space/FetchFlyURL";
import { useUser } from "@stackframe/stack";
import BottomBar from "@components/space/BottomBar";
import RightSideBar from "@components/space/RightSideBar";
import { ServiceMethods } from "@lib/servicesMethods";
import { useState, useEffect } from "react";
import CursorContainer from "@components/space/CursorContainer";
import EnterSpace from "@components/space/EnterSpace";
import Image from "next/image";

interface UserState {
	username: string;
	color: string;
	cursor: string;
	x: number;
	y: number;
}
interface User {
	username: string;
	state: UserState;
}
interface Users {
	[uuid: string]: User;
}

const SpacePage: React.FC = () => {
	const params = useParams();
	const spaceId = params.spaceId as string;
	const [username, setUsername] = useState("");
	const [color, setColor] = useState<string>("");
	const [selectedCursor, setSelectedCursor] = useState<string>("");
	const [enterSpace, setEnterSpace] = useState<boolean>(false);
	const [otherUsers, setOtherUsers] = useState<Users>({});
	const user = useUser({ or: "redirect" });

	const fetch = async () => {
		try {
			const { accessToken, refreshToken } = await user.getAuthJson();
			if (!accessToken || !refreshToken) return null;
			const serviceMethods = new ServiceMethods(accessToken, refreshToken);
			const result = await serviceMethods.fetchUser();
			return result;
		} catch (error) {
			console.error("Error during submission:", error);
		}
	};

	function getRandomInt(min: number, max: number) {
		const minimum = Math.ceil(min);
		const maximum = Math.floor(max);
		return Math.floor(Math.random() * (maximum - minimum + 1)) + min;
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const fetchAndSetUserData = async () => {
			const result = await fetch();
			if (result) {
				setUsername(result.username);
			} else {
				const randNum: number = getRandomInt(1, 100);
				setUsername(`user${randNum}`);
			}
		};
		fetchAndSetUserData();
	}, [user]);

	return (
		<>
			<Image
				src="/hop.png"
				alt="Logo"
				width={150}
				height={150}
				priority
				className="fixed z-50 left-60 mt-[21.5%] -rotate-90"
			/>
			<div className="relative flex h-screen flex-col overflow-hidden">
				<div className="flex flex-grow overflow-hidden relative">
					<main className="flex-grow flex flex-col relative ">
						<div className="relative flex-grow flex items-center justify-center">
							{enterSpace ? (
								<CursorContainer
									username={username}
									color={color}
									selectedCursor={selectedCursor}
									otherUsers={otherUsers}
									setOtherUsers={setOtherUsers}
								/>
							) : (
								<EnterSpace
									onSubmit={setEnterSpace}
									setColorProp={setColor}
									username={username}
								/>
							)}
							<VncDisplay spaceId={spaceId} />
						</div>
						<BottomBar
							setSelectedCursor={setSelectedCursor}
							otherUsers={otherUsers}
						/>
					</main>
					<RightSideBar />
				</div>
			</div>
		</>
	);
};

export default SpacePage;
