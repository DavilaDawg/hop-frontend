"use client";

import ScrollBar from "@components/ui/SrollBar";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { FiSend, FiSmile } from "react-icons/fi";
import { ServiceMethods } from "@lib/servicesMethods";
import { useUser } from "@stackframe/stack";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
interface ChatMessage {
	type: "chat" | "join";
	username: string;
	message?: string;
}

const ChatContainer: React.FC = () => {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [inputMessage, setInputMessage] = useState("");
	const [username, setUsername] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	//const []
	const user = useUser({ or: "redirect" });
	const wsRef = useRef<WebSocket | null>(null);
	const isInitialConnection = useRef(true);

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
			}
		};
		fetchAndSetUserData();
	}, [user]);

	useEffect(() => {
		if (!username) return;

		const connectWebSocket = () => {
			const WS_URL = `wss://hop-websocket1-76a542d0c47b.herokuapp.com?username=${encodeURIComponent(username)}`;
			const ws = new WebSocket(WS_URL);

			ws.onopen = () => {
				console.log("open ws");
				if (isInitialConnection.current) {
					const joinMessage = {
						type: "join",
						username: username,
					};
					ws.send(JSON.stringify(joinMessage));
					isInitialConnection.current = false;
				}
			};

			ws.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data) as ChatMessage;
					if (data.type === "chat") {
						setMessages((prevMessages) => [...prevMessages, data]);
					}
				} catch (error) {
					console.error("Error processing WebSocket message:", error);
				}
			};

			ws.onclose = () => {
				console.log(
					"WebSocket disconnected, attempting to reconnect in 3 seconds...",
				);
				setTimeout(connectWebSocket, 3000);
				setTimeout(connectWebSocket, 20000);
			};
			wsRef.current = ws;
		};

		connectWebSocket();

		return () => {
			if (wsRef.current) {
				wsRef.current.close();
			}
		};
	}, [username]);

	const handleSendMessage = () => {
		if (inputMessage.trim() && wsRef.current) {
			const message = {
				type: "chat",
				username: username,
				message: inputMessage,
			};
			wsRef.current.send(JSON.stringify(message));
			setInputMessage("");
		}
	};

	const handleEmojiSelect = (emoji: { native: string }) => {
		setInputMessage((prevMessage) => prevMessage + emoji.native);
		setShowEmojiPicker(false);
	};

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const EmojiPicker: any = Picker;

	return (
		<div className="flex flex-col h-full p-4">
			<p className="text-3xl font-semibold p-2">Chat</p>

			<div className="flex-grow bg-white rounded-xl p-4 flex flex-col">
				<div className="flex-grow overflow-y-auto">
					<ScrollBar>
						{messages.map((msg, index) => {
							if (!msg.username) return null;

							return ( // margin top auto
								<p
									className="first:mt-auto whitespace-pre-wrap break-words border-2 mt-2 rounded-xl p-2 bg-purple-200 text-green-800 border-purple-400 shadow-2xl"
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={index}
								>
									{`${msg.username}: ${msg.message}`}
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
							onClick={() => setShowEmojiPicker(!showEmojiPicker)}
						>
							<FiSmile className="w-5 h-5" />
						</button>
						{showEmojiPicker && (
							<div className="absolute bottom-14">
								<Picker data={data} perLine="6" theme="dark" maxFrequentRows="2" onEmojiSelect={handleEmojiSelect} />
							</div>
						)} 
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
