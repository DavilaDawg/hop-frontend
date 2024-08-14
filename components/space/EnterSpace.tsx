"use client";

// biome-ignore lint/style/useImportType: <explanation>
import React, { useState, useEffect } from "react";
import randomColor from "randomcolor";
import useWebSocket from "react-use-websocket";
import Image from "next/image";
interface NicknameProps {
	onSubmit: (username: string) => void;
	setColorProp: (color: string) => void;
	realUsername: string;
}

const EnterSpace: React.FC<NicknameProps> = ({
	onSubmit,
	setColorProp,
	realUsername,
}) => {
	const [color, setColor] = useState("");
	const [wsUrl, setWsUrl] = useState<string | null>(null);

	// FETCH NICKNAME FROM DB
	const username = "isa"; // FOR TESTING

	const { sendJsonMessage } = useWebSocket(wsUrl, {
		shouldReconnect: () => false,
		reconnectAttempts: 0,
		share: true,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!color) {
			const newColor = randomColor();
			setColor(newColor);
			setColorProp(color);
		}
	}, [color]);

	useEffect(() => {
		if (realUsername) {
			setWsUrl(
				`ws://localhost:8000?username=${encodeURIComponent(realUsername)}`,
			);
		}
	}, [realUsername]);

	const handleClick = () => {
		onSubmit(username);
		sendJsonMessage({
			type: "setRealUsername",
			realUsername: realUsername,
		});
	};

	return (
		<div className="relative text-white rounded-xl shadow-lg p-6 w-96 mx-auto h-56 mt-[23%] ml-[41%] z-50 flex items-center justify-center">
			<Image
				src="/images/Logo.webp"
				alt="Logo"
				width={700}
				height={700} 
				priority
				className="absolute z-0"
			/>

			<button
				type="submit"
				suppressHydrationWarning
				onClick={handleClick}
				className="bg-pink-400 hover:bg-pink-500 text-white p-4 rounded-xl text-2xl font-bold absolute z-10"
				style={{ top: '106%', left: '50%', transform: 'translate(-50%, -50%)' }}
			>
				Hop In
			</button>
		</div>
	);
};

export default EnterSpace;
