"use client";

// biome-ignore lint/style/useImportType: <explanation>
import React, { useState, useEffect } from "react";
import randomColor from "randomcolor";
import useWebSocket from "react-use-websocket";
import Image from "next/image";
interface NicknameProps {
	onSubmit: (enterSpace: boolean) => void;
	setColorProp: (color: string) => void;
	realUsername: string;
}

// For guest viewers
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
		const newColor = randomColor();
		setColor(newColor);
	}, []);

	useEffect(() => {
		if (realUsername) {
			setWsUrl(
				`ws://localhost:8000?username=${encodeURIComponent(realUsername)}`,
			);
		}
	}, [realUsername]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (username) {
			onSubmit(true);
			setColorProp(color);

			sendJsonMessage({
				type: "setRealUsername",
				realUsername: realUsername,
			});
		}
	};

	return (
		<div className="absolute inset-0 flex items-center justify-center z-50">
			<div className="relative flex items-center justify-center w-96 h-96">
				<Image
					src="/images/Logo.webp"
					alt="Logo"
					width={700}
					height={700}
					priority
					className="absolute inset-0 object-cover"
					style={{ top: "10%" }} 
				/>
				<div className="relative bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-sm mx-4 mt-80">
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
		</div>
	);
};

export default SetNickname;
