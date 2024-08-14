"use client"

import type React from "react";
import SpaceSettings from "./SpaceSettings";
import ChatContainer from "./ChatContainer";

interface RightSideBarProps {
	realUsername: string;
  }

const RightSideBar: React.FC<RightSideBarProps> = ({realUsername}) => {
	return (
		<div className="w-72 bg-gray-600 border-l border-gray-300 flex flex-col">
			<div className="flex-grow">
				<SpaceSettings />
			</div>
			<ChatContainer realUsername={realUsername}/>
		</div>
	);
};

export default RightSideBar;
