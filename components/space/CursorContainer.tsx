"use client";

import React, { useEffect, useRef, useState } from "react";
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
	state: UserState;
}

interface Users {
	[uuid: string]: User;
}

interface HomeProps {
	username: string;
	color: string;
	selectedCursor: string;
}

const renderCursors = (
	users: Users,
	color?: string,
	selectedCursor?: string,
	username?: string,
) => {
	return Object.keys(users).map((uuid) => {
		const user = users[uuid];
		const userColor = user.state?.color || "";
		const x = user.state?.x ?? 0;
		const y = user.state?.y ?? 0;

		return (
			<React.Fragment key={uuid}>
				{user.state?.cursor === "/norm.png" || user.state?.cursor === "" ? (
					<Cursor
						color={userColor}
						point={[x, y]}
						username={user.state?.username}
					/>
				) : (
					<CustomCursor
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
			{Object.keys(users).map((uuid) => (
				<li key={uuid}>{users[uuid].username}</li>
			))}
		</ul>
	);
};

const CursorContainer: React.FC<HomeProps> = ({
	username,
	color,
	selectedCursor,
}) => {
	const [otherUsers, setOtherUsers] = useState<Users>({});
	const [isTracking, setIsTracking] = useState<boolean>(true);
	const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});

	const WS_URL = `ws://10.10.22.20:8000?username=${encodeURIComponent(username)}&selectedCursor=${encodeURIComponent(selectedCursor)}&color=${encodeURIComponent(color)}`;

	const containerRef = useRef<HTMLDivElement | null>(null);

	const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL);

	const THROTTLE = 10;
	const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));

	useEffect(() => {
		sendJsonMessage({
			x: 0,
			y: 0,
			cursor: selectedCursor,
			username: username,
			color: color,
		});
	}, [sendJsonMessage, selectedCursor, username, color]);

	useEffect(() => {
		if (lastJsonMessage) {
			const users = lastJsonMessage as Users;
			const filteredUsers = Object.keys(users).reduce<Users>((acc, uuid) => {
				if (users[uuid].username !== username) {
					acc[uuid] = users[uuid];
				}
				return acc;
			}, {});

			setOtherUsers(filteredUsers);
		}
	}, [lastJsonMessage, username]);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (containerRef.current && isTracking) {
			const rect = containerRef.current.getBoundingClientRect();
			const data = {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
				cursor: selectedCursor,
				username: username,
				color: color,
			};
			setMousePosition(data);
			sendJsonMessageThrottled.current(data);
		}
	};

	const handleMouseDown = () => {
		console.log("Mouse down");
		setIsTracking(false);
	};

	const handleMouseUp = () => {
		console.log("Mouse up");
		setIsTracking(true);
		sendJsonMessage(mousePosition);
	};

	return (
		<div
			ref={containerRef}
			className={`absolute inset-0 z-20 text-black ${isTracking ? "pointer-events-auto" : "pointer-events-none"}`}
			onMouseMove={handleMouseMove}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
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
