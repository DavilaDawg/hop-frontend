"use client";

import { useParams } from "next/navigation";
import VncDisplay from "@components/space/FetchFlyURL";
import { useUser } from "@stackframe/stack";
import BottomBar from "@components/space/BottomBar";
import BottomBar2 from "@components/space/BottomBar2";
import RightSideBar from "@components/space/RightSideBar";
import { ServiceMethods } from "@lib/servicesMethods";
import { useState, useEffect, useRef } from "react";
import CursorContainer from "@components/space/CursorContainer";
import EnterSpace from "@components/space/EnterSpace";
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

const SpacePage: React.FC = () => {
	const params = useParams();
	const spaceId = params.spaceId as string;
	const [username, setUsername] = useState("");
	const [pfp, setPfp] = useState("");
	const [nickname, setNickname] = useState("");
	const [color, setColor] = useState<string>("");
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
				setPfp(result.profilePicture);
				setNickname(result.nickname);
			} else {
				const randNum: number = getRandomInt(1, 100);
				setUsername(`user${randNum}`);
			}
		};
		fetchAndSetUserData();
	}, [user]);

	return (
		<>
			<div className="relative flex h-screen flex-col overflow-hidden">
				<div className="flex flex-grow overflow-hidden relative">
					<main className="flex-grow flex flex-col relative ">
						<div className="relative flex-grow flex items-center justify-center">
							{enterSpace ? (
								<CursorContainer
									username={username}
									nickname={nickname}
									pfp={pfp}
									color={color}
									setOtherUsers={setOtherUsers}
								/>
							) : (
								<EnterSpace
									onSubmit={setEnterSpace}
									setColorProp={setColor}
									username={username}
									pfp={pfp}
									nickname={nickname}
								/>
							)}
							<VncDisplay spaceId={spaceId} />
						</div>
						<BottomBar2 otherUsers={otherUsers} />
					</main>
					<RightSideBar />
				</div>
			</div>
		</>
	);
};

export default SpacePage;
