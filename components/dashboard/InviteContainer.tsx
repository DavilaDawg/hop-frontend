"use client";

import { useState } from "react";
import InviteComponent from "./InviteComponent";
import ScrollBar from "../ui/SrollBar";

const InviteContainer: React.FC = () => {
	const [invites, setInvites] = useState([
		{ id: "1", spaceName: "Space 1", username: "User 1", pfp: "/PFP.jpg" },
		{ id: "2", spaceName: "Space 2", username: "User 2", pfp: "/PFP.jpg" },
		{ id: "3", spaceName: "Space 3", username: "User 3", pfp: "/PFP.jpg" },
		{ id: "4", spaceName: "Space 4", username: "User 4", pfp: "/PFP.jpg" },
		{ id: "5", spaceName: "Space 5", username: "User 5", pfp: "/PFP.jpg" },
		{ id: "6", spaceName: "Space 6", username: "User 6", pfp: "/PFP.jpg" },
	]); // mock, fetch from backend later

	const handleInviteUpdate = (id: string) => {
		setInvites((prevInvites) =>
			prevInvites.filter((invite) => invite.id !== id),
		);
	};

	return (
		<div className="rounded-xl w-full h-56 bg-gray-800 mt-2 pl-3 overflow-hidden">
			<h1 className="text-xl font-bold pt-2 mb-1">Invites</h1>
			<div className="overflow-auto h-[calc(100%-3rem)]"> 
				<ScrollBar>
					{invites.map((invite) => (
						<InviteComponent
							key={invite.id}
							id={invite.id}
							spaceName={invite.spaceName}
							username={invite.username}
							pfp={invite.pfp}
							onHandle={() => handleInviteUpdate}
						/>
					))}
				</ScrollBar>
			</div>
		</div>
	);
};

export default InviteContainer;
