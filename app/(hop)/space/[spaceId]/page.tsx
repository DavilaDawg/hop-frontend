"use client";

import type React from "react";
import { useEffect, useState } from "react";
import RightSideBar from "@components/space/RightSideBar";
import BottomBar from "@components/space/BottomBar";
import CursorContainer from "@components/space/CursorContainer";
import SetNickname from "@components/space/SetNickname";
import EnterSpace from "@components/space/EnterSpace";
import Image from "next/image";

const SpacePage: React.FC = () => {
	const [username, setUsername] = useState<string>(""); // actually nickname, isa will change this later
	const [color, setColor] = useState<string>("");
	const [selectedCursor, setSelectedCursor] = useState<string>("");
	const [member, setMember] = useState<boolean>(true);

	// BUG STARTS HERE MEMBERS- NO CURSOR

	// Get User data /api/user
	//const realUsername = "DavilaDawg"; // for testing
	const realUsername= "";

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!realUsername) {
			setMember(!true);
		}
	}, [realUsername]);

	return (
		<div>
			{!username ? (
				<Image
					src="/hop.png"
					alt="Logo"
					width={150}
					height={150}
					priority
					className="absolute z-50 left-[9.6%] mt-[21.5%] -rotate-90"
				/>
			) : (
				""
			)}
			<div className="flex h-screen overflow-hidden">
				<main className="flex-grow flex flex-col overflow-hidden relative">
					<div className="relative flex-grow">
						{username ? (
							<CursorContainer
								username={username}
								color={color}
								selectedCursor={selectedCursor}
							/>
						) : member ? (
							<EnterSpace
								onSubmit={setUsername}
								setColorProp={setColor}
								realUsername={realUsername}
							/>
						) : (
							<SetNickname
								onSubmit={setUsername}
								setColorProp={setColor}
								realUsername={realUsername}
							/>
						)}
						<iframe
							className="absolute inset-0 w-full h-full z-0"
							title="vnc"
							src="https://isaaaaaaaaaaaaaaaaa.fly.dev/"
						/>
					</div>
					<BottomBar setSelectedCursor={setSelectedCursor} />
				</main>
				<RightSideBar realUsername={realUsername} />
			</div>
		</div>
	);
};

export default SpacePage;
