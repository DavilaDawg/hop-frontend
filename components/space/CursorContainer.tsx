import React from "react";
import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
import { Cursor } from "./Cursor";
import { CustomCursor } from "./CustomCursor";
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
interface HomeProps {
	username: string;
	pfp: string;
	nickname: string;
	color: string;
	selectedCursor: string;
	otherUsers: Users;
	setOtherUsers: React.Dispatch<React.SetStateAction<Users>>;
}

const renderCursors = (
	users: Users,
	color?: string,
	selectedCursor?: string,
	username?: string,
) => {
	return Object.keys(users).map((uuid) => {
		const user = users[uuid];
		const cursor = user.state?.cursor || "";
		const color = user.state?.color || "";
		const x = user.state?.x ?? 0;
		const y = user.state?.y ?? 0;

		return (
			<React.Fragment key={uuid}>
				{user.state?.cursor === "/norm.png" || user.state?.cursor === "" ? (
					<Cursor
						key={uuid}
						color={color}
						point={[x, y]}
						username={user.state?.username}
					/>
				) : (
					<CustomCursor
						key={uuid}
						point={[x, y]}
						imageUrl={user.state?.cursor}
						username={user.state?.username}
					/>
				)}
			</React.Fragment>
		);
	});
};

const renderUsersList = (users: Users) => {
	return (
		<ul>
			{Object.keys(users).map((uuid) => {
				return <li key={uuid}>{users[uuid].username}</li>;
			})}
		</ul>
	);
};

const CursorContainer: React.FC<HomeProps> = ({
	username,
	color,
	selectedCursor,
	pfp, 
	nickname, 
	otherUsers,
	setOtherUsers,
}) => {
	const [isTracking, setIsTracking] = useState(true);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	const WS_URL = `wss://hop-websocket1-76a542d0c47b.herokuapp.com?username=${encodeURIComponent(username)}&selectedCursor=${encodeURIComponent(selectedCursor)}&color=${encodeURIComponent(color)}&pfp=${encodeURIComponent(pfp)}&nickname=${encodeURIComponent(nickname)}`;

	const containerRef = useRef<HTMLDivElement>(null);

	const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL);

	const THROTTLE = 10;

	const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		console.log("first message", username, nickname, pfp, color )
		sendJsonMessage({
			x: 0,
			y: 0,
			cursor: selectedCursor,
			username: username,
			nickname: nickname, 
			pfp: pfp,
			color: color,
		});

		

		const handleMouseMove = (e: MouseEvent) => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				const data = {
					x: e.clientX - rect.left,
					y: e.clientY - rect.top,
					cursor: selectedCursor,
					username: username,
					color: color,
				};
				setMousePosition(data);
				if (isTracking) {
					sendJsonMessageThrottled.current(data);
				}
			}
		};

		const container = containerRef.current;

		if (container) {
			container.addEventListener("mousemove", handleMouseMove);
		}

		return () => {
			if (container) {
				container.removeEventListener("mousemove", handleMouseMove);
			}
		};
	}, [sendJsonMessage, username]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (lastJsonMessage) {
				const users = lastJsonMessage as Users;
				console.log("users", users)
				const seenUsernames = new Set<string>();

				const filteredUsers = Object.keys(users).reduce<Users>((acc, uuid) => {
					const currentUser = users[uuid];
					console.log("currentUser:", currentUser)
					if (
						currentUser.username !== username &&
						!seenUsernames.has(currentUser.username) && currentUser.username !== ""
					) {
						seenUsernames.add(currentUser.username);
						
						acc[uuid] = {
							username: currentUser.username, 
							nickname: currentUser.nickname, 
							pfp: currentUser.pfp,        
							state: currentUser.state 
						  };
					}
					return acc;
				}, {});
				setOtherUsers(filteredUsers);
				console.log("filteredUsers", filteredUsers)
		}
	}, [lastJsonMessage, username, nickname, pfp, color, selectedCursor]);

	const handleMouseDown = () => {
		setIsTracking(false);
	};

	const handleMouseUp = () => {
		setIsTracking(true);
		sendJsonMessage(mousePosition);
	};

	return (
		<div
			ref={containerRef}
			className="absolute inset-0 bg-transparent z-20 text-black"
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			style={{ pointerEvents: isTracking ? "auto" : "none" }}
		>
			<h1>Hello, {username}</h1>
			<p>Current users:</p>
			{Object.keys(otherUsers).length === 0 ? (
				<p>No other users online.</p>
			) : (
				<>
					{renderUsersList(otherUsers)}
					{renderCursors(otherUsers, color, selectedCursor, username)}
				</>
			)}
		</div>
	);
};

export default CursorContainer;
