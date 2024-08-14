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

// For anonomos viewers
const SetNickname: React.FC<NicknameProps> = ({
	onSubmit,
	setColorProp,
	realUsername,
}) => {
	const [username, setUsername] = useState("");
	const [color, setColor] = useState("");
	const [wsUrl, setWsUrl] = useState<string | null>(null);

	const { sendJsonMessage } = useWebSocket(wsUrl, {
		shouldReconnect: () => false,
		reconnectAttempts: 0,
		share: true,
	});

	useEffect(() => {
		if (username && !color) {
			const newColor = randomColor();
			setColor(newColor);
		}
	}, [username, color]);

	useEffect(() => {
		if (realUsername) {
		  setWsUrl(`ws://10.10.22.20:8000?username=${encodeURIComponent(realUsername)}`);
		}
	  }, [realUsername]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (username) {
			onSubmit(username);
			setColorProp(color);
			
			sendJsonMessage({
				type: "setRealUsername",
				realUsername: realUsername,
			});
		}
	};

	return (
		<div className="relative text-white rounded-xl shadow-lg p-6 w-96 mx-auto mt-[27%] z-50 flex flex-col items-center justify-center">
			<Image
				src="/images/Logo.webp"
				alt="Logo"
				width={700}
				height={700}
				priority
				className="absolute z-0"
			/>
			<div className="absolute z-10 rounded-xl p-6 shadow-lg w-full mt-[67%]">
				<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
					<input
						type="text"
						value={username}
						placeholder="Enter your nickname..."
						onChange={(e) => setUsername(e.target.value)}
						maxLength={6}
						className="border border-gray-600 rounded-md p-2 bg-gray-900 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-500"
					/>
					<button
						type="submit"
						className="bg-pink-400 hover:bg-pink-500 text-white rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-600"
					>
						Hop In
					</button>
				</form>
			</div>
		</div>
	);
};

export default SetNickname;
