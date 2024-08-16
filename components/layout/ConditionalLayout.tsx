"use client";

import LeftSidebar from "@components/layout/LeftSidebar";

interface Friend {
	id: string;
	nickname: string;
	username: string;
	profilePicture?: string;
	isOnline?: boolean;
	currentRoom?: string;
}

export default function ConditionalLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// const pathname = usePathname();
	// const showSidebar = ![
	// 	"/",
	// 	"/login",
	// 	"/register",
	// 	"/handler/sign-up",
	// 	"/handler/sign-in",
	// ].includes(pathname);

	return (
		<div className="flex h-screen">
			<LeftSidebar friends={[]} />
			<main className="flex-1 overflow-auto">{children}</main>
		</div>
	);
}
