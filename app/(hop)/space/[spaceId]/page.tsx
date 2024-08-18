"use client";

import { useParams } from "next/navigation";
import VncDisplay from "@components/space/FetchFlyURL";
import { useUser } from "@stackframe/stack";
import BottomBar from "@components/space/BottomBar";
import RightSideBar from "@components/space/RightSideBar";
import { ServiceMethods } from "@lib/servicesMethods";
import { useState, useEffect, useRef } from "react";
import CursorContainer from "@components/space/CursorContainer";
import EnterSpace from "@components/space/EnterSpace";
import Image from "next/image";
import useWebSocket from "react-use-websocket";

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
interface FooterMessage {
	type: "footer";
	username: string;
	nickname?: string;
	pfp?: string;
}

const SpacePage: React.FC = () => {
	const params = useParams();
	const spaceId = params.spaceId as string;
	const [username, setUsername] = useState("");
	const [pfp, setPfp] = useState("");
	const [nickname, setNickname] = useState("");
	const [color, setColor] = useState<string>("");
	const [selectedCursor, setSelectedCursor] = useState<string>("");
	const [enterSpace, setEnterSpace] = useState<boolean>(false);
	const [otherUsers, setOtherUsers] = useState<Users>({});
	const [footerInfo, setFooterInfo] = useState<FooterMessage[]>([]);
	const user = useUser({ or: "redirect" });
	const wsRef = useRef<WebSocket | null>(null);

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

	const WS_URL = `wss://hop-websocket1-76a542d0c47b.herokuapp.com?username=${encodeURIComponent(username)}&pfp=${encodeURIComponent(pfp)}&nickname=${encodeURIComponent(nickname)}`;

	const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL);

	useEffect(() => {
		if (readyState === WebSocket.CLOSED) {
			console.error("WebSocket connection closed unexpectedly");
		}
	}, [readyState]);

	useEffect(() => {
		if (lastJsonMessage) {
			try {
				const data = lastJsonMessage as FooterMessage;
				setFooterInfo((prev) => [...prev, data]);
			} catch (error) {
				console.error("Error processing WebSocket message:", error);
			}
		}
	}, [lastJsonMessage]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		sendJsonMessage({
			type: "footer",
			username: username,
			nickname: nickname, 
			pfp: pfp,
		});
	}, [enterSpace]);

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
									nickname={nickname}
									pfp={pfp}
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
									pfp={pfp}
									nickname={nickname}
								/>
							)}
							<VncDisplay spaceId={spaceId} />
						</div>
						<BottomBar
							setSelectedCursor={setSelectedCursor}
							otherUsers={otherUsers}
							footerInfo={footerInfo}
						/>
					</main>
					<RightSideBar />
				</div>
			</div>
		</>
	);
};

export default SpacePage;
