import type React from "react";
import { useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
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
	setOtherUsers: React.Dispatch<React.SetStateAction<Users>>;
}

const CursorContainer: React.FC<HomeProps> = ({
	username,
	color,
	pfp,
	nickname,
	setOtherUsers,
}) => {

	const WS_URL = `wss://hop-websocket1-76a542d0c47b.herokuapp.com?username=${encodeURIComponent(username)}&color=${encodeURIComponent(color)}&pfp=${encodeURIComponent(pfp)}&nickname=${encodeURIComponent(nickname)}`;

	const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
		shouldReconnect: () => true,
		reconnectAttempts: 100,
		share: true,
	});

	const THROTTLE = 10;

	const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const timeoutId = setInterval(() => {
			sendJsonMessageThrottled.current("");
			if (lastJsonMessage) {
				const users = lastJsonMessage as Users;
				const seenUsernames = new Set<string>();

				const filteredUsers = Object.keys(users).reduce<Users>((acc, uuid) => {
					const currentUser = users[uuid];
					if (
						currentUser.username !== username &&
						!seenUsernames.has(currentUser.username) &&
						currentUser.username !== "" &&
						currentUser.pfp
					) {
						seenUsernames.add(currentUser.username);

						acc[uuid] = {
							username: currentUser.username,
							nickname: currentUser.nickname,
							pfp: currentUser.pfp,
							state: currentUser.state,
						};
					}
					return acc;
				}, {});
				setOtherUsers(filteredUsers);
			}
		}, 50);
		return () => clearTimeout(timeoutId);

	}, [lastJsonMessage, username]);

	return (
		<div>
		</div>
	);
};

export default CursorContainer;
