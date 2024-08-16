"use client";

import ScrollBar from "@components/ui/SrollBar";
import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { FiSend, FiSmile } from "react-icons/fi";
import useWebSocket from "react-use-websocket";
import { ServiceMethods } from "@lib/servicesMethods";
import { useUser } from "@stackframe/stack";

interface ChatMessage {
	type: "chat" | "join";
	username: string;
	message?: string;
}

const ChatContainer: React.FC = () => {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [inputMessage, setInputMessage] = useState("");
	const [username, setUsername] = useState("");
	const user = useUser({ or: "redirect" });

	const fetch = async () => {
		try {
			const { accessToken, refreshToken } = await user.getAuthJson();
			if (!accessToken || !refreshToken) return
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
			}
		};
		fetchAndSetUserData();
	}, [user]);

	const WS_URL = useMemo(
		() => `ws://localhost:8000?username=${encodeURIComponent(username)}`,
		[username],
	);

	const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL);

	useEffect(() => {
		if (readyState === WebSocket.CLOSED) {
			console.error("WebSocket connection closed unexpectedly");
		}
	}, [readyState]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (lastJsonMessage) {
			try {
				const data = lastJsonMessage as ChatMessage;
				if (
					data.type === "chat" ||
					(data.type === "join" && messages.length < 1)
				) {
					setMessages((prevMessages) => [...prevMessages, data]);
				}
			} catch (error) {
				console.error("Error processing WebSocket message:", error);
			}
		}
	}, [lastJsonMessage]);

	const handleSendMessage = () => {
		if (inputMessage.trim()) {
			sendJsonMessage({
				type: "chat",
				username: username,
				message: inputMessage,
			});
			setInputMessage("");
		}
	};

	return (
		<div className="flex flex-col h-full p-4">
			<p className="text-3xl font-semibold p-2">Chat</p>

			<div className="flex-grow bg-white rounded-xl p-4 flex flex-col">
				<div className="flex-grow overflow-y-auto">
					<ScrollBar>
						{messages.map((msg, index) => {
							const isJoinMessage = msg.type === "join";
							const messageClasses = isJoinMessage
								? "bg-green-100 text-green-800 border-green-300"
								: "bg-blue-100 text-blue-800 border-blue-300";

							return (
								<p
									className={`whitespace-pre-wrap break-words border-2 mt-2 rounded-xl p-2 ${messageClasses}`}
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={index}
								>
									{isJoinMessage
										? `${username} joined`
										: `${username}: ${msg.message}`}
								</p>
							);
						})}
					</ScrollBar>
				</div>
			</div>

			<div className="mt-4">
				<div className="p-2 border-t border-gray-300">
					<div className="relative flex items-center">
						<button
							type="button"
							className="absolute left-2 text-gray-500 hover:text-gray-700 focus:outline-none"
						>
							<FiSmile className="w-5 h-5" />
						</button>
						<input
							type="text"
							value={inputMessage}
							onChange={(e) => setInputMessage(e.target.value)}
							onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
							placeholder="Type a message..."
							className="w-full p-3 pl-12 pr-16 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						<button
							type="button"
							onClick={handleSendMessage}
							className="absolute right-2 text-blue-500 hover:text-blue-600 focus:outline-none p-2"
						>
							<FiSend className="w-6 h-6" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatContainer;
