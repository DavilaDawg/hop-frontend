"use client";
import type React from "react";

import { useUser } from "@stackframe/stack";
import SpaceContainer from "@components/dashboard/SpaceContainer";
import { useEffect, useState } from "react";
import { ServiceMethods } from "@lib/servicesMethods";

interface UserDataType {
	userId: string;
	username: string;
	nickname: string;
	profilePicture: string;
}

const Dashboard: React.FC = () => {
	const user = useUser({ or: "redirect" });
	const [userData, setUserData] = useState<UserDataType>();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		async function fetchData() {
			const { accessToken, refreshToken } = await user.getAuthJson();
			const serviceMethods = new ServiceMethods(
				accessToken || "",
				refreshToken || "",
			);
			const userDataReq = await serviceMethods.fetchUser();
			setUserData(userDataReq);
			console.log("dash userdata:", userData);
			return userData;
		}
		fetchData();
	}, []);

	const link: string = "link placeholder"; // ??
	const members: number = 4;
	const screen: string = "/placeholder.jpg"; // ??

	return (
		<div className="flex bg-gray-700 text-white h-screen">
			<SpaceContainer
				screen={screen}

				pfp={userData?.profilePicture || "https://res.cloudinary.com/dksp40fgp/image/upload/v1723767101/oklypy7hrfwisbjnxwaw.png"}
				link={link}
				members={members}
				realUsername={userData?.username || ""}
			/>
		</div>
	);
};

export default Dashboard;
